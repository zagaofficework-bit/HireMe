import apiClient from "./apiClient";

const ADMIN_BASE = "/admin";
const COMPANY_BASE = "/company";

// ── Platform ─────────────────────────────────────────────────────
export const getPlatformOverview = () =>
  apiClient.get(`${ADMIN_BASE}/overview`).then((r) => r.data.data);

// ── User Management ─────────────────────────────────────────────
export const getAllUsers = (params) =>
  apiClient.get(`${ADMIN_BASE}/users`, { params }).then((r) => r.data.data);

export const getUserDetail = (id) =>
  apiClient.get(`${ADMIN_BASE}/users/${id}`).then((r) => r.data.data);

export const banUser = (id, banReason) =>
  apiClient
    .patch(`${ADMIN_BASE}/users/${id}/ban`, { banReason })
    .then((r) => r.data.data);

export const unbanUser = (id) =>
  apiClient.patch(`${ADMIN_BASE}/users/${id}/unban`).then((r) => r.data.data);

export const suspendUser = (id, reason) =>
  apiClient
    .patch(`${ADMIN_BASE}/users/${id}/suspend`, { reason })
    .then((r) => r.data.data);

export const unsuspendUser = (id) =>
  apiClient
    .patch(`${ADMIN_BASE}/users/${id}/unsuspend`)
    .then((r) => r.data.data);

// ── Profile Management ──────────────────────────────────────────
export const featureProfile = (id, isFeatured) =>
  apiClient
    .patch(`${ADMIN_BASE}/profiles/${id}/feature`, { isFeatured })
    .then((r) => r.data.data);

export const verifyProfile = (id, isVerified) =>
  apiClient
    .patch(`${ADMIN_BASE}/profiles/${id}/verify`, { isVerified })
    .then((r) => r.data.data);

export const deleteProfile = (id) =>
  apiClient.delete(`${ADMIN_BASE}/profiles/${id}`).then((r) => r.data.data);

// ── Profile Approval ────────────────────────────────────────────
// Triggered when a freelancer submits their profile for review.
// approveProfile: sets approvalStatus → "approved"
// rejectProfile:  sets approvalStatus → "rejected", stores the reason
// getPendingProfiles: lists all profiles where approvalStatus === "pending"

export const getPendingProfiles = (params) =>
  apiClient
    .get(`${ADMIN_BASE}/profiles/pending`, { params })
    .then((r) => r.data.data);

export const approveProfile = (id) =>
  apiClient
    .patch(`${ADMIN_BASE}/profiles/${id}/approve`)
    .then((r) => r.data.data);

export const rejectProfile = (id, reason) =>
  apiClient
    .patch(`${ADMIN_BASE}/profiles/${id}/reject`, { reason })
    .then((r) => r.data.data);

// ── Company Moderation (lives under /company/admin/*) ──────────
export const getAllCompanies = (params) =>
  apiClient
    .get(`${COMPANY_BASE}/admin/all`, { params })
    .then((r) => r.data.data);

export const verifyCompany = (id) =>
  apiClient
    .patch(`${COMPANY_BASE}/admin/${id}/verify`)
    .then((r) => r.data.data);

export const rejectCompany = (id, reason) =>
  apiClient
    .patch(`${COMPANY_BASE}/admin/${id}/reject`, { reason })
    .then((r) => r.data.data);