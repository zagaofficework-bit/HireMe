// src/features/company/services/company.api.js
import apiClient from "./apiClient";

const BASE = '/company';

// ── Client ────────────────────────────────────────────────────────────────────

export const createCompanyApi = (data) =>
  apiClient.post(BASE, data);

export const getMyCompanyApi = () =>
  apiClient.get(`${BASE}/me`);

export const updateCompanyApi = (data) =>
  apiClient.patch(`${BASE}/me`, data); 

export const uploadCompanyLogoApi = (formData) =>
  apiClient.post(`${BASE}/me/logo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// ── Public ────────────────────────────────────────────────────────────────────

export const getCompanyBySlugApi = (slug) =>
  apiClient.get(`${BASE}/${slug}`);

// ── Admin ─────────────────────────────────────────────────────────────────────

export const getAllCompaniesApi = ({ status, page = 1, limit = 20 } = {}) =>
  apiClient.get(`${BASE}/admin/all`, { params: { status, page, limit } });

export const verifyCompanyApi = (id) =>
  apiClient.patch(`${BASE}/admin/${id}/verify`);

export const rejectCompanyApi = (id, rejectionReason) =>
  apiClient.patch(`${BASE}/admin/${id}/reject`, { rejectionReason });