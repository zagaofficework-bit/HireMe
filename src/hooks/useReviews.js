// src/features/reviews/hooks/useReviews.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchProfileReviews,
  fetchMyReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../api/reviews.api";

const keys = {
  profile: (profileId, params) => ['reviews', 'profile', profileId, params],
  my: ['reviews', 'my'],
};

// ── Read: reviews on a profile (public) ────────────────────────────
export const useProfileReviews = (profileId, { page = 1, limit = 10, sortBy = 'newest' } = {}) => {
  return useQuery({
    queryKey: keys.profile(profileId, { page, limit, sortBy }),
    queryFn: () => fetchProfileReviews(profileId, { page, limit, sortBy }),
    enabled: !!profileId,
    keepPreviousData: true,
  });
};

// ── Read: reviews I (client) have written ──────────────────────────
export const useMyReviews = () => {
  return useQuery({
    queryKey: keys.my,
    queryFn: fetchMyReviews,
  });
};

// ── Write: create review ────────────────────────────────────────────
export const useCreateReview = (profileId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'profile', profileId] });
      queryClient.invalidateQueries({ queryKey: keys.my });
    },
  });
};

// ── Write: update review ────────────────────────────────────────────
export const useUpdateReview = (profileId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, rating, comment }) => updateReview(reviewId, { rating, comment }),
    onSuccess: () => {
      if (profileId) queryClient.invalidateQueries({ queryKey: ['reviews', 'profile', profileId] });
      queryClient.invalidateQueries({ queryKey: keys.my });
    },
  });
};

// ── Write: delete review ────────────────────────────────────────────
export const useDeleteReview = (profileId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      if (profileId) queryClient.invalidateQueries({ queryKey: ['reviews', 'profile', profileId] });
      queryClient.invalidateQueries({ queryKey: keys.my });
    },
  });
};