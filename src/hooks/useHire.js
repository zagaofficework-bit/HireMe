// src/features/hire/hooks/useHire.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  sendHireRequest,
  acceptHireRequestApi,
  rejectHireRequestApi,
  cancelHireRequestApi,
  fetchIncomingHireRequests,
  fetchSentHireRequests,
  fetchHireRequestById,
} from "../api/hire.api";

const HIRE_KEY = ['hire'];
const NOTIFICATIONS_KEY = ['notifications'];

// ── Client: send a hire request ─────────────────────────────────────────────
export const useSendHireRequest = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ profileId, message }) => sendHireRequest(profileId, message),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [...HIRE_KEY, 'sent'] });
      options.onSuccess?.(data, variables, context);
    },
    onError: options.onError,
  });
};

// ── Client: cancel a pending sent request ───────────────────────────────────
export const useCancelHireRequest = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelHireRequestApi,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [...HIRE_KEY, 'sent'] });
      options.onSuccess?.(data, variables, context);
    },
    onError: options.onError,
  });
};

// ── Client: outbox — their sent requests + live status ──────────────────────
export const useSentHireRequests = () =>
  useQuery({
    queryKey: [...HIRE_KEY, 'sent'],
    queryFn: fetchSentHireRequests,
  });

// ── Freelancer: inbox — incoming requests awaiting a response ───────────────
export const useIncomingHireRequests = () =>
  useQuery({
    queryKey: [...HIRE_KEY, 'incoming'],
    queryFn: fetchIncomingHireRequests,
  });

// ── Freelancer: accept an incoming request ──────────────────────────────────
export const useAcceptHireRequest = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptHireRequestApi,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [...HIRE_KEY, 'incoming'] });
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
      options.onSuccess?.(data, variables, context);
    },
    onError: options.onError,
  });
};

// ── Freelancer: reject an incoming request ──────────────────────────────────
export const useRejectHireRequest = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectHireRequestApi,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [...HIRE_KEY, 'incoming'] });
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
      options.onSuccess?.(data, variables, context);
    },
    onError: options.onError,
  });
};

// ── Either party: single request detail ──────────────────────────────────────
export const useHireRequest = (id) =>
  useQuery({
    queryKey: [...HIRE_KEY, 'detail', id],
    queryFn: () => fetchHireRequestById(id),
    enabled: !!id,
  });