import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  verifyPhoneOtp,
  sendEmailOtp,
  verifyEmailOtp,
  loginWithGoogle,
  logoutApi,
  getMe,
  completeProfile,
} from "./auth.api";

// ─── Token helpers ─────────────────────────────────────────────────────────────
export const saveTokens = ({ accessToken }) => {
  if (accessToken) localStorage.setItem("accessToken", accessToken);
};

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
};

const extractError = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong.";

// ─── THUNKS ────────────────────────────────────────────────────────────────────

export const loginWithPhone = createAsyncThunk(
  "auth/loginWithPhone",
  async ({ phone, firebaseIdToken }, { rejectWithValue }) => {
    try {
      const { data } = await verifyPhoneOtp({ phone, firebaseIdToken });
      saveTokens(data.data);
      return data.data;
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
      saveTokens(data.data);
      return data.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const loginWithGoogleThunk = createAsyncThunk(
  "auth/loginWithGoogle",
  async ({ idToken }, { rejectWithValue }) => {
    try {
      const { data } = await loginWithGoogle({ idToken });
      saveTokens(data.data);
      return data.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getMe();
      return data.data?.user ?? data.data ?? data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

// export const completeUserProfile = createAsyncThunk(
//   "auth/completeProfile",
//   async ({ username, email }, { rejectWithValue }) => {
//     try {
//       const { data } = await completeProfile({ username, email });
//       return data.data?.user ?? data.data;
//     } catch (err) {
//       return rejectWithValue(extractError(err));
//     }
//   }
// );

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
    }
  },
);

// ─── SLICE ─────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isNewUser: false,
    loading: false,
    initializing: true, // true ONLY on first app load
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
    // ✅ Called when no token found on boot — skip API call, just stop spinner
    finishInitializing: (state) => {
      state.initializing = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const rejected = (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    };

    builder
      // ── fetchCurrentUser (boot only) ─────────────────────────────────────
      .addCase(fetchCurrentUser.pending, (state) => {
        state.initializing = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
        state.initializing = false;
        state.user = payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.initializing = false;
        state.user = null;
        clearTokens(); // token invalid/expired — saaf karo
      })

      // ── loginWithPhone ────────────────────────────────────────────────────
      .addCase(loginWithPhone.pending, pending)
      .addCase(loginWithPhone.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.isNewUser = payload.isNewUser ?? false;
        state.initializing = false; // ✅ ensure spinner nahi dikhe
      })
      .addCase(loginWithPhone.rejected, rejected)

      // ── sendOtpToEmail ────────────────────────────────────────────────────
      .addCase(sendOtpToEmail.pending, pending)
      .addCase(sendOtpToEmail.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(sendOtpToEmail.rejected, rejected)

      // ── verifyOtpFromEmail ────────────────────────────────────────────────
      .addCase(verifyOtpFromEmail.pending, pending)
      .addCase(verifyOtpFromEmail.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.otpSent = false;
        state.initializing = false;
      })
      .addCase(verifyOtpFromEmail.rejected, rejected)

      // ── loginWithGoogleThunk ──────────────────────────────────────────────
      .addCase(loginWithGoogleThunk.pending, pending)
      .addCase(loginWithGoogleThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.initializing = false;
      })
      .addCase(loginWithGoogleThunk.rejected, rejected)

      // ── completeUserProfile ───────────────────────────────────────────────
      .addCase(completeUserProfile.pending, pending)
      .addCase(completeUserProfile.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
        state.isNewUser = false;
      })
      .addCase(completeUserProfile.rejected, rejected)

      // ── logoutUser ────────────────────────────────────────────────────────
      .addCase(logoutUser.fulfilled, (state) => {
        // ✅ Full reset — initializing false rakho, spinner nahi aana chahiye
        state.user = null;
        state.isNewUser = false;
        state.otpSent = false;
        state.error = null;
        state.loading = false;
        state.initializing = false; // ✅ false — logout ke baad spinner nahi
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
