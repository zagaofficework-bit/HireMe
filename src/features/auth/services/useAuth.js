import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../../config/firebase";
import {
  fetchCurrentUser,
  loginWithPhone,
  loginWithGoogleThunk,
  logoutUser,
  sendOtpToEmail,
  verifyOtpFromEmail,
  completeUserProfile,
  clearAuthError,
  updateUser,
  finishInitializing,
} from "./auth.slice";

// ✅ Module-level flag — app lifetime mein sirf ONCE session check hoga
// Redux ke bahar — re-render se affect nahi hota
let bootCheckDone = false;

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, initializing, error, otpSent, isNewUser } =
    useSelector((s) => s.auth);

  // ── Boot: session restore — sirf ek baar ────────────────────────────────
  useEffect(() => {
    if (bootCheckDone) return; // ✅ Already check ho gaya — dobara mat karo
    bootCheckDone = true; // ✅ Flag set karo pehle

    const token = localStorage.getItem("accessToken");
    if (token) {
      dispatch(fetchCurrentUser());
    } else {
      dispatch(finishInitializing()); // spinner hatao, koi API call nahi
    }
  }, []); // eslint-disable-line

  // ── reCAPTCHA setup ──────────────────────────────────────────────────────
  const setupRecaptcha = async (containerId = "recaptcha-container") => {
    try {
      // already exists
      if (window.recaptchaVerifier) {
        return window.recaptchaVerifier;
      }

      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: "invisible",
        callback: () => {},
        "expired-callback": () => {
          window.recaptchaVerifier = null;
        },
      });

      await window.recaptchaVerifier.render();

      return window.recaptchaVerifier;
    } catch (err) {
      console.error("Recaptcha setup failed:", err);
      throw err;
    }
  };

  // ── SMS OTP send ─────────────────────────────────────────────────────────
  const sendOtp = async (phone, containerId = "recaptcha-container") => {
    try {
      const verifier = await setupRecaptcha(containerId);

      const confirmation = await signInWithPhoneNumber(auth, phone, verifier);

      window.confirmationResult = confirmation;
      return { success: true };
    } catch (err) {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (_) {}
        window.recaptchaVerifier = null;
      }
      return { success: false, error: err?.message || "Failed to send OTP" };
    }
  };

  // ── Phone login ───────────────────────────────────────────────────────────
  const handleLogin = async ({ phone }) => sendOtp(phone);

  const handleVerifyLoginOtp = async ({ otp }) => {
    try {
      if (!window.confirmationResult)
        return { success: false, error: "Session expired. Please resend OTP." };

      const result = await window.confirmationResult.confirm(otp);
      const firebaseIdToken = await result.user.getIdToken();
      const res = await dispatch(
        loginWithPhone({ phone: result.user.phoneNumber, firebaseIdToken }),
      );
      if (loginWithPhone.fulfilled.match(res)) return { success: true };
      return { success: false, error: res.payload };
    } catch (err) {
      return { success: false, error: err?.message || "Verification failed" };
    }
  };

  // ── Phone register ────────────────────────────────────────────────────────
  const handleRegister = async ({ phone }) => sendOtp(phone);

  const handleVerifyRegisterOtp = async ({ otp }) => {
    try {
      if (!window.confirmationResult)
        return { success: false, error: "Session expired. Please resend OTP." };

      const result = await window.confirmationResult.confirm(otp);
      const firebaseIdToken = await result.user.getIdToken();
      const res = await dispatch(
        loginWithPhone({ phone: result.user.phoneNumber, firebaseIdToken }),
      );
      if (loginWithPhone.fulfilled.match(res)) return { success: true };
      return { success: false, error: res.payload };
    } catch (err) {
      return { success: false, error: err?.message || "Verification failed" };
    }
  };

  // ── Google ────────────────────────────────────────────────────────────────
  const handleGoogleAuth = async (credential) => {
    const res = await dispatch(loginWithGoogleThunk({ idToken: credential }));
    if (loginWithGoogleThunk.fulfilled.match(res)) {
      return {
        success: true,
        user: res.payload.user,
        isNewUser: res.payload.isNewUser ?? false,
        requiresMobile: res.payload.requiresMobile ?? false,
      };
    }
    return { success: false, error: res.payload };
  };

  // ── Email OTP ─────────────────────────────────────────────────────────────
  const handleSendEmailOtp = async (email) => {
    const res = await dispatch(sendOtpToEmail({ email }));
    if (sendOtpToEmail.fulfilled.match(res)) return { success: true };
    return { success: false, error: res.payload };
  };

  const handleVerifyEmailOtp = async (email, otp) => {
    const res = await dispatch(verifyOtpFromEmail({ email, otp }));
    if (verifyOtpFromEmail.fulfilled.match(res)) return { success: true };
    return { success: false, error: res.payload };
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    bootCheckDone = false; // ✅ Reset flag — next login pe fresh check hoga
    await dispatch(logoutUser());
  };

  return {
    user,
    loading,
    initializing,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isSeller: user?.role === "seller",
    isNewUser,
    otpSent,
    error,

    sendOtp,
    handleLogin,
    handleVerifyLoginOtp,
    handleRegister,
    handleVerifyRegisterOtp,
    handleGoogleAuth,
    handleSendEmailOtp,
    handleVerifyEmailOtp,
    handleLogout,
    handleCompleteProfile: async (data) => {
      const res = await dispatch(completeUserProfile(data));
      if (completeUserProfile.fulfilled.match(res)) return { success: true };
      return { success: false, error: res.payload };
    },

    updateUser: (fields) => dispatch(updateUser(fields)),
    clearError: () => dispatch(clearAuthError()),
  };
};
