// src/features/reviews/services/reviews.api.js
import apiClient from './apiClient';

/**
 * Reviews API
 * Thin wrapper over apiClient — one function per backend route.
 * Mirrors backend/routes/reviews/reviews.routes.js exactly.
 */

// GET /reviews/profile/:profileId  (public)
export const fetchProfileReviews = async (profileId, { page = 1, limit = 10, sortBy = 'newest' } = {}) => {
  const { data } = await apiClient.get(`/reviews/profile/${profileId}`, {
    params: { page, limit, sortBy },
  });
  return data.data; // { reviews, pagination }
};

// GET /reviews/my  (client only)
export const fetchMyReviews = async () => {
  const { data } = await apiClient.get('/reviews/my');
  return data.data.reviews;
};

// POST /reviews  (client only)
export const createReview = async ({ profileId, rating, comment }) => {
  const { data } = await apiClient.post('/reviews', { profileId, rating, comment });
  return data.data.review;
};

// PATCH /reviews/:id  (client only, own review)
export const updateReview = async (reviewId, { rating, comment }) => {
  const { data } = await apiClient.patch(`/reviews/${reviewId}`, { rating, comment });
  return data.data.review;
};

// DELETE /reviews/:id  (client only, own review)
export const deleteReview = async (reviewId) => {
  const { data } = await apiClient.delete(`/reviews/${reviewId}`);
  return data;
};

// PATCH /reviews/:id/toggle-visibility  (admin only)
export const toggleReviewVisibility = async (reviewId) => {
  const { data } = await apiClient.patch(`/reviews/${reviewId}/toggle-visibility`);
  return data.data.review;
};