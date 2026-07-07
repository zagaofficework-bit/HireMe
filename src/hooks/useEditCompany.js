// src/features/company/hooks/useEditCompany.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createCompanyApi,
  updateCompanyApi,
  uploadCompanyLogoApi,
} from "../api/company.api";
import { companyKeys } from './useCompany';

// ── Create company ────────────────────────────────────────────────────────────
export const useCreateCompany = (callbacks = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => createCompanyApi(data),
    onSuccess: (res, ...args) => {
      qc.invalidateQueries({ queryKey: companyKeys.mine() });
      callbacks.onSuccess?.(res, ...args);
    },
    onError: callbacks.onError,
  });
};

// ── Update company ────────────────────────────────────────────────────────────
export const useUpdateCompany = (callbacks = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateCompanyApi(data),
    onSuccess: (res, ...args) => {
      qc.invalidateQueries({ queryKey: companyKeys.mine() });
      callbacks.onSuccess?.(res, ...args);
    },
    onError: callbacks.onError,
  });
};

// ── Upload logo ───────────────────────────────────────────────────────────────
export const useUploadCompanyLogo = (callbacks = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file) => {
      const fd = new FormData();
      fd.append('logo', file);
      return uploadCompanyLogoApi(fd);
    },
    onSuccess: (res, ...args) => {
      qc.invalidateQueries({ queryKey: companyKeys.mine() });
      callbacks.onSuccess?.(res, ...args);
    },
    onError: callbacks.onError,
  });
};