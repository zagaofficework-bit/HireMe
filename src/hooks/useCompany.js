// src/features/company/hooks/useCompany.js
import { useQuery } from '@tanstack/react-query';
import { getMyCompanyApi, getCompanyBySlugApi } from "../api/company.api";

// ── Query keys ────────────────────────────────────────────────────────────────
export const companyKeys = {
  all:    ['company'],
  mine:   () => [...companyKeys.all, 'mine'],
  public: (slug) => [...companyKeys.all, 'public', slug],
};

// ── My company (client) ───────────────────────────────────────────────────────
export const useMyCompany = () =>
  useQuery({
    queryKey: companyKeys.mine(),
    queryFn: async () => {
      const { data } = await getMyCompanyApi();
      return data.data?.company ?? data.data;
    },
    retry: (failCount, error) => {
      // Don't retry 404 — means company not created yet
      if (error?.response?.status === 404) return false;
      return failCount < 2;
    },
    staleTime: 1000 * 60 * 5, // 5 min
  });

// ── Public company by slug ────────────────────────────────────────────────────
export const usePublicCompany = (slug) =>
  useQuery({
    queryKey: companyKeys.public(slug),
    queryFn: async () => {
      const { data } = await getCompanyBySlugApi(slug);
      return data.data?.company ?? data.data;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 10, // 10 min
  });