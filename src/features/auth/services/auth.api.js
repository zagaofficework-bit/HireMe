// src/features/auth/services/auth.api.js
import apiClient from "../../../api/apiClient";

export const verifyPhoneOtp   = (data) => apiClient.post("/auth/phone/verify",      data);
export const sendEmailOtp     = (data) => apiClient.post("/auth/email/send-otp",     data);
export const verifyEmailOtp   = (data) => apiClient.post("/auth/email/verify-otp",   data);
export const loginWithGoogle  = (data) => apiClient.post("/auth/google",             data);
export const refreshTokenApi  = (rt)   => apiClient.post("/auth/refresh",    { refreshToken: rt });
export const logoutApi        = ()     => apiClient.post("/auth/logout");
export const getMe            = ()     => apiClient.get("/auth/me");


export const completeProfile = (data) => apiClient.patch("/auth/complete-profile", {
  username:  data.username,
  email:     data.email,
  name:      data.name,       // ← add this (some backends use `name`)
  firstname: data.firstname,
  lastname:  data.lastname,
});