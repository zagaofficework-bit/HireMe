// src/features/verification/hooks/useVerification.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getVerificationStatus,
  sendEmailVerification,
  verifyEmail,
  sendPhoneOtp,
  verifyPhone,
} from "../api/verification.api";

const STATUS_KEY = ['verification', 'status'];

// ── Status ──────────────────────────────────────────────────────────
export const useVerificationStatus = (options = {}) => {
  return useQuery({
    queryKey: STATUS_KEY,
    queryFn: getVerificationStatus,
    staleTime: 60 * 1000,
    ...options,
  });
};

// ── Email ───────────────────────────────────────────────────────────
export const useSendEmailVerification = () => {
  return useMutation({
    mutationFn: sendEmailVerification,
    onSuccess: (data) => {
      toast.success(data?.message || 'Verification email sent');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Could not send verification email');
    },
  });
};

export const useVerifyEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: (data) => {
      toast.success(data?.message || 'Email verified');
      queryClient.invalidateQueries({ queryKey: STATUS_KEY });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Invalid or expired token');
    },
  });
};

// ── Phone ───────────────────────────────────────────────────────────
export const useSendPhoneOtp = () => {
  return useMutation({
    mutationFn: sendPhoneOtp,
    onSuccess: (data) => {
      toast.success(data?.message || 'OTP sent to your phone');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Could not send OTP');
    },
  });
};

export const useVerifyPhone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verifyPhone,
    onSuccess: (data) => {
      toast.success(data?.message || 'Phone verified');
      queryClient.invalidateQueries({ queryKey: STATUS_KEY });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Invalid or expired OTP');
    },
  });
};