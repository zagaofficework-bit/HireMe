// src/api/apiClient.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,  // ← THIS sends the httpOnly cookie automatically
  timeout: 15_000,
});

// Attach access token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-refresh on 401
let isRefreshing = false;
let failedQueue  = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => error ? p.reject(error) : p.resolve(token));
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes("/auth/refresh")
    ) {
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
        // Cookie is sent automatically — no need to pass refreshToken manually
        const { data } = await apiClient.post("/auth/refresh");

        const newAccess = data.data?.accessToken ?? data.accessToken;
        localStorage.setItem("accessToken", newAccess);
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
        original.headers["Authorization"] = `Bearer ${newAccess}`;

        processQueue(null, newAccess);
        return apiClient(original);
      } catch (err) {
        processQueue(err, null);
        // Clear access token and redirect to login
        localStorage.removeItem("accessToken");
        window.location.href = "/auth/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;