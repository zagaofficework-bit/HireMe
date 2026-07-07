// src/features/search/hooks/useSearch.js
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { searchProfiles, fetchSkillSuggestions, fetchNearbyProfiles } from "../api/search.api";

export const SEARCH_KEY = ['search'];

/**
 * useSearchProfiles
 * Main search query — re-runs whenever the filters object changes.
 * `keepPreviousData` keeps the old result list visible (with isFetching
 * true) while the new page loads, instead of flashing a loading state
 * on every filter tweak.
 * `options` allows callers to pass { enabled } etc. (e.g. CategoryPage
 * gates the query until category._id is resolved).
 */
export const useSearchProfiles = (filters = {}, options = {}) =>
  useQuery({
    queryKey: [...SEARCH_KEY, 'profiles', filters],
    queryFn: () => searchProfiles(filters),
    placeholderData: keepPreviousData,
    ...options,
  });

/**
 * useSearchSuggestions
 * Skill autocomplete. Disabled until query is at least 2 characters —
 * matches backend's own minimum-length guard, so we don't fire a
 * request that will just come back empty.
 */
export const useSearchSuggestions = (query) =>
  useQuery({
    queryKey: [...SEARCH_KEY, 'suggestions', query],
    queryFn: () => fetchSkillSuggestions(query),
    enabled: Boolean(query) && query.trim().length >= 2,
    staleTime: 60_000,
  });

/**
 * useNearbyProfiles
 * Disabled until coordinates are available (e.g. before geolocation
 * resolves) — pass `null` as `coords` to keep it idle.
 */
export const useNearbyProfiles = (coords, options = {}) =>
  useQuery({
    queryKey: [...SEARCH_KEY, 'nearby', coords],
    queryFn: () => fetchNearbyProfiles(coords),
    enabled: Boolean(coords?.lat && coords?.lng),
    ...options,
  });