// src/features/verification/services/verification.api.js
import apiClient from './apiClient';

const BASE = '/verification';

// GET /api/v1/verification/status
export const getVerificationStatus = async () => {
  const { data } = await apiClient.get(`${BASE}/status`);
  return data.data;
};

// POST /api/v1/verification/send-email
export const sendEmailVerification = async () => {
  const { data } = await apiClient.post(`${BASE}/send-email`);
  return data.data;
};

// POST /api/v1/verification/verify-email
// userId is optional — only needed when verifying via the emailed link
// (where the user may not have an active session yet).
export const verifyEmail = async ({ token, userId }) => {
  const { data } = await apiClient.post(`${BASE}/verify-email`, { token, userId });
  return data.data;
};

// POST /api/v1/verification/send-phone-otp
export const sendPhoneOtp = async (phone) => {
  const { data } = await apiClient.post(`${BASE}/send-phone-otp`, { phone });
  return data.data;
};

// POST /api/v1/verification/verify-phone
export const verifyPhone = async ({ phone, otp }) => {
  const { data } = await apiClient.post(`${BASE}/verify-phone`, { phone, otp });
  return data.data;
};