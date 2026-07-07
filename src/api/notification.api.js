// src/features/notifications/services/notifications.api.js
import apiClient from './apiClient';

const BASE = '/notifications';

// GET /notifications?page=&limit=&unreadOnly=
export const fetchNotifications = async ({ page = 1, limit = 20, unreadOnly = false } = {}) => {
  const { data } = await apiClient.get(BASE, {
    params: { page, limit, unreadOnly },
  });
  return data.data; // { notifications, unreadCount, pagination }
};

// GET /notifications/unread-count
export const fetchUnreadCount = async () => {
  const { data } = await apiClient.get(`${BASE}/unread-count`);
  return data.data; // { count }
};

// PATCH /notifications/:id/read
export const markNotificationRead = async (id) => {
  const { data } = await apiClient.patch(`${BASE}/${id}/read`);
  return data.data; // { notification }
};

// PATCH /notifications/mark-all-read
export const markAllNotificationsRead = async () => {
  const { data } = await apiClient.patch(`${BASE}/mark-all-read`);
  return data.data;
};

// DELETE /notifications/:id
export const deleteNotificationById = async (id) => {
  const { data } = await apiClient.delete(`${BASE}/${id}`);
  return data.data;
};