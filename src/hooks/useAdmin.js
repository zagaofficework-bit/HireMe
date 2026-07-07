import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as adminApi from "../api/admin.api";

// ── Queries ──────────────────────────────────────────────────────
export const useAdminOverview = () =>
  useQuery({
    queryKey: ["admin", "overview"],
    queryFn: adminApi.getPlatformOverview,
  });

export const useAdminUsers = (filters) =>
  useQuery({
    queryKey: ["admin", "users", filters],
    queryFn: () => adminApi.getAllUsers(filters),
    keepPreviousData: true,
  });

export const useAdminUserDetail = (id) =>
  useQuery({
    queryKey: ["admin", "user", id],
    queryFn: () => adminApi.getUserDetail(id),
    enabled: !!id,
  });

export const useAdminCompanies = (filters) =>
  useQuery({
    queryKey: ["admin", "companies", filters],
    queryFn: () => adminApi.getAllCompanies(filters),
    keepPreviousData: true,
  });

// Profiles pending approval — used on the dedicated approvals page / dashboard badge
export const useAdminPendingProfiles = (params) =>
  useQuery({
    queryKey: ["admin", "profiles", "pending", params],
    queryFn: () => adminApi.getPendingProfiles(params),
    keepPreviousData: true,
  });

// ── Mutations (shared invalidation helper) ──────────────────────
function useAdminMutation(mutationFn, invalidateKeys = []) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      invalidateKeys.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key })
      );
    },
  });
}

export const useBanUser = () =>
  useAdminMutation(
    ({ id, banReason }) => adminApi.banUser(id, banReason),
    [["admin", "users"], ["admin", "user"], ["admin", "overview"]]
  );

export const useUnbanUser = () =>
  useAdminMutation(
    (id) => adminApi.unbanUser(id),
    [["admin", "users"], ["admin", "user"], ["admin", "overview"]]
  );

export const useSuspendUser = () =>
  useAdminMutation(
    ({ id, reason }) => adminApi.suspendUser(id, reason),
    [["admin", "users"], ["admin", "user"], ["admin", "overview"]]
  );

export const useUnsuspendUser = () =>
  useAdminMutation(
    (id) => adminApi.unsuspendUser(id),
    [["admin", "users"], ["admin", "user"], ["admin", "overview"]]
  );

export const useFeatureProfile = () =>
  useAdminMutation(
    ({ id, isFeatured }) => adminApi.featureProfile(id, isFeatured),
    [["admin", "users"], ["admin", "user"]]
  );

export const useVerifyProfile = () =>
  useAdminMutation(
    ({ id, isVerified }) => adminApi.verifyProfile(id, isVerified),
    [["admin", "users"], ["admin", "user"]]
  );

export const useDeleteProfile = () =>
  useAdminMutation(
    (id) => adminApi.deleteProfile(id),
    [["admin", "users"], ["admin", "user"]]
  );

// ── Profile Approval Mutations ───────────────────────────────────
export const useApproveProfile = () =>
  useAdminMutation(
    (id) => adminApi.approveProfile(id),
    [["admin", "user"], ["admin", "profiles", "pending"], ["admin", "overview"]]
  );

export const useRejectProfile = () =>
  useAdminMutation(
    ({ id, reason }) => adminApi.rejectProfile(id, reason),
    [["admin", "user"], ["admin", "profiles", "pending"], ["admin", "overview"]]
  );

// ── Company Mutations ────────────────────────────────────────────
export const useVerifyCompany = () =>
  useAdminMutation(
    (id) => adminApi.verifyCompany(id),
    [["admin", "companies"], ["admin", "overview"]]
  );

export const useRejectCompany = () =>
  useAdminMutation(
    ({ id, reason }) => adminApi.rejectCompany(id, reason),
    [["admin", "companies"], ["admin", "overview"]]
  );