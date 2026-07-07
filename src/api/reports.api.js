// src/features/reports/services/reports.api.js
import apiClient from './apiClient';

const BASE = '/reports';

// POST /api/v1/reports
export const submitReport = async ({ profileId, reason, description }) => {
  const { data } = await apiClient.post(BASE, { profileId, reason, description });
  return data.data;
};