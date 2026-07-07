// src/features/auth/hooks/useAuth.js
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../config/firebase';

// ✅ Correct relative paths — this file lives at:
//    src/features/auth/hooks/useAuth.js
//    └── slice is at  ../services/auth.slice   (one level up → services/)
//    └── api is at    ../services/auth.api     (co-located in services/)
//        OR if auth.api.js lives at src/api/   → ../../../api/auth.api
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
} from "../features/auth/services/auth.slice";                 // ✅ was: "../features/auth/services/auth.slice"
import { registerUserApi, registerClientApi } from "../api/auth.api"; // ✅ was: "../api/auth.api"

// ── Boot check ────────────────────────────────────────────────────────────────
// Module-level flag so the boot fetch runs exactly once, even under React 18
// StrictMode (which double-invokes effects in dev).
let bootCheckDone = false;

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, initializing, error, otpSent, isNewUser } =
    useSelector((s) => s.auth);

  const dispatchRef = useRef(dispatch);
  dispatchRef.current = dispatch;

  useEffect(() => {
    if (bootCheckDone) return;
    bootCheckDone = true;

    const token = localStorage.getItem('accessToken');
    if (token) {
      // Token exists → try to restore session via /auth/me
      // The apiClient interceptor will silently refresh if the AT is expired
      dispatchRef.current(fetchCurrentUser());
    } else {
      // No token at all → nothing to restore, stop the initializing spinner
      dispatchRef.current(finishInitializing());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── reCAPTCHA ──────────────────────────────────────────────────────────────
  const setupRecaptcha = async (containerId = 'recaptcha-container') => {
    try {
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch (_) {}
        window.recaptchaVerifier = null;
      }
      window.confirmationResult = null;

      document.querySelectorAll('iframe[src*="recaptcha"]').forEach((el) => el.remove());
      document.querySelectorAll('.grecaptcha-badge').forEach((el) => el.remove());

      await new Promise((resolve, reject) => {
        const el = document.getElementById(containerId);
        if (el) { el.innerHTML = ''; return resolve(el); }
        let attempts = 0;
        const interval = setInterval(() => {
          const found = document.getElementById(containerId);
          if (found) {
            found.innerHTML = '';
            clearInterval(interval);
            resolve(found);
          }
          if (++attempts > 20) {
            clearInterval(interval);
            reject(new Error(`reCAPTCHA container #${containerId} not found`));
          }
        }, 100);
      });

      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: () => {},
        'expired-callback': () => { window.recaptchaVerifier = null; },
      });

      await window.recaptchaVerifier.render();
      return window.recaptchaVerifier;
    } catch (err) {
      window.recaptchaVerifier = null;
      console.error('Recaptcha setup failed:', err);
      throw err;
    }
  };

  // ── Phone OTP ──────────────────────────────────────────────────────────────
  const sendOtp = async (phone, containerId = 'recaptcha-container') => {
    try {
      const verifier     = await setupRecaptcha(containerId);
      const confirmation = await signInWithPhoneNumber(auth, phone, verifier);
      window.confirmationResult = confirmation;
      return { success: true };
    } catch (err) {
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch (_) {}
        window.recaptchaVerifier = null;
      }
      return { success: false, error: err?.message || 'Failed to send OTP' };
    }
  };

  const handleLogin                = async ({ phone }) => sendOtp(phone);

  const handleVerifyLoginOtp = async ({ otp }) => {
    try {
      if (!window.confirmationResult)
        return { success: false, error: 'Session expired. Please resend OTP.' };

      const result          = await window.confirmationResult.confirm(otp);
      const firebaseIdToken = await result.user.getIdToken();
      const res             = await dispatch(loginWithPhone({ phone: result.user.phoneNumber, firebaseIdToken }));
      if (loginWithPhone.fulfilled.match(res)) return { success: true };
      return { success: false, error: res.payload };
    } catch (err) {
      return { success: false, error: err?.message || 'Verification failed' };
    }
  };

  const handleRegister = async ({ phone }) => sendOtp(phone);

  const handleVerifyRegisterOtp = async ({ otp }) => {
    try {
      if (!window.confirmationResult)
        return { success: false, error: 'Session expired. Please resend OTP.' };

      const result          = await window.confirmationResult.confirm(otp);
      const firebaseIdToken = await result.user.getIdToken();
      const phone           = result.user.phoneNumber;
      const name            = sessionStorage.getItem('pendingName')  || '';
      const email           = sessionStorage.getItem('pendingEmail') || '';
      const role            = sessionStorage.getItem('pendingRole')  || 'freelancer';

      const registerFn = role === 'client' ? registerClientApi : registerUserApi;
      try {
        await registerFn({ name, email, phone }, firebaseIdToken);
      } catch (regErr) {
        if (regErr?.response?.status !== 409)
          return { success: false, error: regErr?.response?.data?.message || 'Registration failed.' };
      }

      const res = await dispatch(loginWithPhone({ phone, firebaseIdToken }));
      if (loginWithPhone.fulfilled.match(res)) return { success: true };
      return { success: false, error: res.payload };
    } catch (err) {
      return { success: false, error: err?.message || 'Verification failed' };
    }
  };

  // ── Google ─────────────────────────────────────────────────────────────────
  const handleGoogleAuth = async (idToken) => {
    const role = sessionStorage.getItem('pendingRole') || 'user';
    const res  = await dispatch(loginWithGoogleThunk({ idToken, role }));
    if (loginWithGoogleThunk.fulfilled.match(res)) {
      return {
        success:        true,
        user:           res.payload.user,
        isNewUser:      res.payload.isNewUser      ?? false,
        requiresMobile: res.payload.requiresMobile ?? false,
      };
    }
    return { success: false, error: res.payload };
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result  = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      return await handleGoogleAuth(idToken);
    } catch (err) {
      if (err?.code === 'auth/popup-closed-by-user')
        return { success: false, error: 'Google sign-in was cancelled.' };
      if (err?.code === 'auth/popup-blocked')
        return { success: false, error: 'Popup blocked. Please allow popups and try again.' };
      return { success: false, error: err?.message || 'Google sign-in failed' };
    }
  };

  // ── Email OTP ──────────────────────────────────────────────────────────────
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

  // ── Logout ─────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    bootCheckDone = false; // reset so next login triggers a fresh boot check
    await dispatch(logoutUser());
  };

  // ── Profile ────────────────────────────────────────────────────────────────
  const handleCompleteProfile = async (data) => {
    const res = await dispatch(completeUserProfile(data));
    if (completeUserProfile.fulfilled.match(res)) return { success: true };
    return { success: false, error: res.payload };
  };

  return {
    user,
    loading,
    initializing,
    isAuthenticated:  !!user,
    isAdmin:          user?.role === 'admin',
    isClient:         user?.role === 'client',
    isFreelancer:     user?.role === 'user',
    isNewUser,
    otpSent,
    error,
    sendOtp,
    handleLogin,
    handleVerifyLoginOtp,
    handleRegister,
    handleVerifyRegisterOtp,
    handleGoogleAuth,
    signInWithGoogle,
    handleSendEmailOtp,
    handleVerifyEmailOtp,
    handleLogout,
    handleCompleteProfile,
    updateUser:  (fields) => dispatch(updateUser(fields)),
    clearError:  ()       => dispatch(clearAuthError()),
  };
};