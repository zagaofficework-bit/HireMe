// src/features/auth/services/auth.slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  verifyPhoneOtp,
  sendEmailOtp,
  verifyEmailOtp,
  loginWithGoogle,
  logoutApi,
  getMe,
  completeProfile,
} from "../../../api/auth.api";
import apiClient from "../../../api/apiClient";
import { auth } from "../../../config/firebase"; // ← Firebase auth instance

// ─── Token helpers ──────────────────────────────────────────────────────────
// We store the Firebase ID token as "accessToken" in localStorage.
// Firebase tokens expire after 1 hour — we refresh them via Firebase SDK
// (not our own /auth/refresh endpoint, which doesn't exist yet).

export const saveTokens = ({ accessToken }) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    apiClient.defaults.headers.common["Authorization"] =
      `Bearer ${accessToken}`;
  }
};

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  delete apiClient.defaults.headers.common["Authorization"];
};

const extractError = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong.";

// ─── Helper: get a fresh Firebase ID token ──────────────────────────────────
// Firebase tokens expire after 1 hour. This gets a fresh one from Firebase
// SDK (uses the cached token if still valid, refreshes automatically if not).
const getFreshFirebaseToken = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  return await currentUser.getIdToken(true); // force=true
};

// ─── THUNKS ─────────────────────────────────────────────────────────────────

export const loginWithPhone = createAsyncThunk(
  "auth/loginWithPhone",
  async ({ phone, firebaseIdToken }, { rejectWithValue }) => {
    try {
      const { data } = await verifyPhoneOtp({ phone, firebaseIdToken });
      // Backend returns { user } — store the Firebase token as the session token
      saveTokens({ accessToken: firebaseIdToken });
      return {
        user: data.data?.user ?? data.data,
        isNewUser: data.data?.isNewUser ?? false,
      };
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const sendOtpToEmail = createAsyncThunk(
  "auth/sendOtpToEmail",
  async ({ email }, { rejectWithValue }) => {
    try {
      const { data } = await sendEmailOtp({ email });
      return data.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const verifyOtpFromEmail = createAsyncThunk(
  "auth/verifyOtpFromEmail",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const { data } = await verifyEmailOtp({ email, otp });
      saveTokens({ accessToken: data.data?.accessToken });
      return data.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const loginWithGoogleThunk = createAsyncThunk(
  "auth/loginWithGoogle",
  async ({ idToken, role }, { rejectWithValue }) => {
    try {
      const { data } = await loginWithGoogle({ role }, idToken);
      // Backend returns { user, requiresMobile } — no JWT issued.
      // Store the Firebase ID token so we can attach it to future requests
      // and restore the session on refresh.
      saveTokens({ accessToken: idToken });
      return {
        user: data.data?.user ?? data.data,
        isNewUser: data.data?.isNewUser ?? false,
        requiresMobile: data.data?.requiresMobile ?? false,
      };
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

/**
 * fetchCurrentUser — called on app boot when a token exists in localStorage.
 *
 * Since we're using Firebase tokens, the stored token may be expired (>1hr).
 * We try to get a fresh one from Firebase SDK first, then call /auth/me.
 */
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      // Try to get a fresh Firebase token (auto-refreshes if expired)
      const freshToken = await getFreshFirebaseToken();
      if (freshToken) {
        // Update stored token and axios header with the fresh one
        saveTokens({ accessToken: freshToken });
      }
      const { data } = await getMe();
      return data.data?.user ?? data.data ?? data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const completeUserProfile = createAsyncThunk(
  "auth/completeProfile",
  async ({ username, email, firstname, lastname }, { rejectWithValue }) => {
    try {
      const { data } = await completeProfile({
        username,
        email,
        firstname,
        lastname,
      });
      return data.data?.user ?? data.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
    } catch (err) {
      console.warn("Logout API error:", err.message);
    } finally {
      clearTokens();
      // Also sign out from Firebase so the SDK clears its cached token
      try {
        await auth.signOut();
      } catch (_) {}
    }
  },
);

// ─── SLICE ──────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isNewUser: false,
    loading: false,
    initializing: true, // ← true until boot check completes
    otpSent: false,
    error: null,
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    clearOtpSent: (state) => {
      state.otpSent = false;
    },
    setUser: (state, { payload }) => {
      state.user = payload;
    },
    updateUser: (state, { payload }) => {
      if (state.user) state.user = { ...state.user, ...payload };
    },
    finishInitializing: (state) => {
      state.initializing = false;
      state.user = null;
    },
  },

  extraReducers: (builder) => {
    const setPending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const setRejected = (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    };

    builder
      // ── fetchCurrentUser ────────────────────────────────────────────────
      .addCase(fetchCurrentUser.pending, (state) => {
        state.initializing = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
        state.initializing = false;
        state.loading = false;
        state.user = payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, { payload }) => {
        state.initializing = false;
        state.loading = false;
        state.user = null;
        state.error = payload ?? null;
      })

      // ── loginWithPhone ──────────────────────────────────────────────────
      .addCase(loginWithPhone.pending, setPending)
      .addCase(loginWithPhone.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.isNewUser = payload.isNewUser ?? false;
        state.initializing = false;
        state.error = null;
      })
      .addCase(loginWithPhone.rejected, setRejected)

      // ── sendOtpToEmail ──────────────────────────────────────────────────
      .addCase(sendOtpToEmail.pending, setPending)
      .addCase(sendOtpToEmail.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(sendOtpToEmail.rejected, setRejected)

      // ── verifyOtpFromEmail ──────────────────────────────────────────────
      .addCase(verifyOtpFromEmail.pending, setPending)
      .addCase(verifyOtpFromEmail.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.otpSent = false;
        state.initializing = false;
        state.error = null;
      })
      .addCase(verifyOtpFromEmail.rejected, setRejected)

      // ── loginWithGoogleThunk ────────────────────────────────────────────
      .addCase(loginWithGoogleThunk.pending, setPending)
      .addCase(loginWithGoogleThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.isNewUser = payload.isNewUser ?? false;
        state.initializing = false;
        state.error = null;
      })
      .addCase(loginWithGoogleThunk.rejected, setRejected)

      // ── completeUserProfile ─────────────────────────────────────────────
      .addCase(completeUserProfile.pending, setPending)
      .addCase(completeUserProfile.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
        state.isNewUser = false;
      })
      .addCase(completeUserProfile.rejected, setRejected)

      // ── logoutUser ──────────────────────────────────────────────────────
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isNewUser = false;
        state.otpSent = false;
        state.error = null;
        state.loading = false;
        state.initializing = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.initializing = false;
        state.loading = false;
      });
  },
});

export const {
  clearAuthError,
  clearOtpSent,
  setUser,
  updateUser,
  finishInitializing,
} = authSlice.actions;

export default authSlice.reducer;
