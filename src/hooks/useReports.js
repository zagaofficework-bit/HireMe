// src/features/reports/hooks/useReport.js
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { submitReport } from '../services/reports.api';

export const useReport = () => {
  return useMutation({
    mutationFn: submitReport,
    onSuccess: (data) => {
      toast.success(data?.message || 'Report submitted. Our team will review it shortly.');
    },
    onError: (error) => {
      const status = error?.response?.status;
      const message = error?.response?.data?.message;

      if (status === 409) {
        toast.error(message || 'You have already reported this profile');
      } else {
        toast.error(message || 'Could not submit report. Please try again.');
      }
    },
  });
};