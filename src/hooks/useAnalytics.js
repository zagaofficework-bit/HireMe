import { useQuery } from "@tanstack/react-query";
import { getHomepageStatsApi, getAdminDashboardStatsApi } from "../api/analytics.api";

export const useHomepageStats = () =>
  useQuery({
    queryKey: ["analytics", "homepage"],
    queryFn: getHomepageStatsApi,
    staleTime: 5 * 60 * 1000,
  });

export const useAdminAnalytics = () =>
  useQuery({
    queryKey: ["analytics", "admin", "dashboard"],
    queryFn: getAdminDashboardStatsApi,
    staleTime: 2 * 60 * 1000,
  });