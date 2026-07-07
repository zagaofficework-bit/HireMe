// src/features/auth/services/auth.api.js  (or src/api/auth.api.js)
import apiClient from './apiClient';

// ── Phone (Firebase-verified) ─────────────────────────────────────────────────

/**
 * Called after OTP confirm — backend looks up or creates the user
 * and returns { user, isNewUser, accessToken }.
 */
export const verifyPhoneOtp = (data) =>
  apiClient.post('/auth/phone/verify', data);

// ── Registration (role-specific) ──────────────────────────────────────────────

export const registerUserApi = ({ name, email, phone }, firebaseIdToken) =>
  apiClient.post(
    '/auth/register/user',
    { name, email, phone },
    { headers: { Authorization: `Bearer ${firebaseIdToken}` } },
  );

export const registerClientApi = ({ name, email, phone }, firebaseIdToken) =>
  apiClient.post(
    '/auth/register/client',
    { name, email, phone },
    { headers: { Authorization: `Bearer ${firebaseIdToken}` } },
  );

// ── Email OTP ─────────────────────────────────────────────────────────────────
export const sendEmailOtp   = (data) => apiClient.post('/auth/email/send-otp',   data);
export const verifyEmailOtp = (data) => apiClient.post('/auth/email/verify-otp', data);

// ── Google OAuth ──────────────────────────────────────────────────────────────

/**
 * FIX: firebaseIdToken goes in the Authorization header (verifyFirebaseToken
 * middleware reads it from there). role goes in the request body so the
 * backend knows which profile type to create on first sign-in.
 */
export const loginWithGoogle = ({ role }, firebaseIdToken) =>
  apiClient.post(
    '/auth/google',
    { role },
    { headers: { Authorization: `Bearer ${firebaseIdToken}` } },
  );

// ── Session ───────────────────────────────────────────────────────────────────
export const refreshTokenApi = (rt) =>
  apiClient.post('/auth/refresh', { refreshToken: rt });

export const logoutApi = () => apiClient.post('/auth/logout');

export const getMe = () => apiClient.get('/auth/me');

// ── Profile completion ────────────────────────────────────────────────────────
export const completeProfile = (data) =>
  apiClient.patch('/auth/complete-profile', {
    username:  data.username,
    email:     data.email,
    name:      data.name,
    firstname: data.firstname,
    lastname:  data.lastname,
  });