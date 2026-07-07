import apiClient from "./apiClient";

const BASE = "/analytics";

export const getHomepageStatsApi = () =>
  apiClient.get(`${BASE}/homepage`).then((r) => r.data.data);

export const getAdminDashboardStatsApi = () =>
  apiClient.get(`${BASE}/admin/dashboard`).then((r) => r.data.data);