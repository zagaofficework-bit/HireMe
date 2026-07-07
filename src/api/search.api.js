// src/features/search/services/search.api.js
import apiClient from './apiClient';

/**
 * Search API service layer
 * Mirrors backend: GET /search, /search/suggestions, /search/nearby
 *
 * ApiResponse shape from backend: { statusCode, data, message, success }
 * so every call unwraps `data.data`.
 */

/**
 * searchProfiles
 * @param {object} params - q, skills, category, city, state, workType,
 *   jobType, availability, minSalary, maxSalary, minRate, maxRate,
 *   verified, minRating, sortBy, page, limit
 * @returns {Promise<{ profiles: object[], pagination: object, appliedFilters: object }>}
 */
export const searchProfiles = async (params = {}) => {
  const { data } = await apiClient.get('/search', { params });
  return data.data;
};

/**
 * fetchSkillSuggestions
 * @param {string} q - partial skill text, min 2 chars (enforced by backend)
 * @returns {Promise<{ skill: string, count: number }[]>}
 */
export const fetchSkillSuggestions = async (q) => {
  if (!q || q.length < 2) return [];
  const { data } = await apiClient.get('/search/suggestions', { params: { q } });
  return data.data.suggestions;
};

/**
 * fetchNearbyProfiles
 * @param {object} params - lat, lng, radiusKm, page, limit
 * @returns {Promise<{ profiles: object[], pagination: object }>}
 */
export const fetchNearbyProfiles = async ({ lat, lng, radiusKm, page, limit } = {}) => {
  const { data } = await apiClient.get('/search/nearby', {
    params: { lat, lng, radiusKm, page, limit },
  });
  return data.data;
};