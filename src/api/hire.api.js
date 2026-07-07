// src/features/hire/services/hire.api.js
import apiClient from './apiClient';

const BASE = '/hire';

// POST /hire/:profileId — client sends a hire request
export const sendHireRequest = async (profileId, message) => {
  const { data } = await apiClient.post(`${BASE}/${profileId}`, { message });
  return data.data.hireRequest;
};

// PATCH /hire/:id/accept — freelancer accepts
export const acceptHireRequestApi = async (id) => {
  const { data } = await apiClient.patch(`${BASE}/${id}/accept`);
  return data.data.hireRequest;
};

// PATCH /hire/:id/reject — freelancer rejects
export const rejectHireRequestApi = async (id) => {
  const { data } = await apiClient.patch(`${BASE}/${id}/reject`);
  return data.data.hireRequest;
};

// PATCH /hire/:id/cancel — client cancels their own pending request
export const cancelHireRequestApi = async (id) => {
  const { data } = await apiClient.patch(`${BASE}/${id}/cancel`);
  return data.data.hireRequest;
};

// GET /hire/incoming — freelancer's inbox
export const fetchIncomingHireRequests = async () => {
  const { data } = await apiClient.get(`${BASE}/incoming`);
  return data.data.requests;
};

// GET /hire/sent — client's outbox
export const fetchSentHireRequests = async () => {
  const { data } = await apiClient.get(`${BASE}/sent`);
  return data.data.requests;
};

// GET /hire/:id — single request detail
export const fetchHireRequestById = async (id) => {
  const { data } = await apiClient.get(`${BASE}/${id}`);
  return data.data.hireRequest;
};