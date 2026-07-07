// src/api/apiClient.js
import axios from "axios";

let _store = null;
export const injectStore = (store) => { _store = store; };

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 15_000,
});

// ── Request interceptor ──────────────────────────────────────────────────────
// FIX: Instead of blindly reading an expired token from localStorage,
// we ask the Firebase SDK first. Firebase auto-refreshes if the cached
// token is expired, so the request always goes out with a valid token.
// This eliminates the "stale token → 401 → rescue" round-trip entirely.
apiClient.interceptors.request.use(
  async (config) => {
    // Don't override if caller already set Authorization (e.g. register routes)
    if (config.headers["Authorization"]) return config;

    try {
      const { auth } = await import("../config/firebase");
      const currentUser = auth.currentUser;

      if (currentUser) {
        // forceRefresh=false → Firebase uses its cached token if still valid,
        // and silently fetches a new one from Google if it's expired.
        const token = await currentUser.getIdToken(false);
        localStorage.setItem("accessToken", token);
        config.headers["Authorization"] = `Bearer ${token}`;
      } else {
        // Firebase SDK not hydrated yet (e.g. very first request on boot) —
        // fall back to whatever is in localStorage. The response interceptor
        // will rescue the 401 if this turns out to be stale.
        const stored = localStorage.getItem("accessToken");
        if (stored) config.headers["Authorization"] = `Bearer ${stored}`;
      }
    } catch {
      // Firebase import or getIdToken failed — fall back to localStorage
      const stored = localStorage.getItem("accessToken");
      if (stored) config.headers["Authorization"] = `Bearer ${stored}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor — last-resort refresh on 401 ───────────────────────
// This is now a safety net for edge cases (e.g. clock skew, SDK not hydrated
// on the very first request). Normal flow is handled in the request interceptor.
let isRefreshing = false;
let failedQueue  = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original       = error.config;
    const is401          = error.response?.status === 401;
    const alreadyRetried = original._retry;
    const isLogoutCall   = original.url?.includes("/auth/logout");

    if (!is401 || alreadyRetried || isLogoutCall) {
      return Promise.reject(error);
    }

    // Queue up concurrent requests that also hit 401 while we're refreshing
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            original.headers["Authorization"] = `Bearer ${token}`;
            resolve(apiClient(original));
          },
          reject,
        });
      });
    }

    original._retry = true;
    isRefreshing    = true;

    try {
      const { auth } = await import("../config/firebase");
      const currentUser = auth.currentUser;

      if (!currentUser) {
        // Firebase session is truly gone — no way to recover
        throw new Error("No Firebase user — session expired");
      }

      // forceRefresh=true — backend rejected the token, so force a brand-new one
      const freshToken = await currentUser.getIdToken(true);

      localStorage.setItem("accessToken", freshToken);
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${freshToken}`;
      original.headers["Authorization"] = `Bearer ${freshToken}`;

      processQueue(null, freshToken);
      return apiClient(original);
    } catch (refreshError) {
      processQueue(refreshError, null);
      localStorage.removeItem("accessToken");
      delete apiClient.defaults.headers.common["Authorization"];

      // Dispatch Redux logout to clear app state
      if (_store) {
        const { logoutUser } = await import("../features/auth/services/auth.slice");
        _store.dispatch(logoutUser());
      }

      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;