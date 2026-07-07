// src/features/reports/services/reports.slice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reportModal: {
    isOpen: false,
    profileId: null,
  },
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    openReportModal: (state, action) => {
      state.reportModal.isOpen = true;
      state.reportModal.profileId = action.payload.profileId;
    },
    closeReportModal: (state) => {
      state.reportModal.isOpen = false;
      state.reportModal.profileId = null;
    },
  },
});

export const { openReportModal, closeReportModal } = reportsSlice.actions;
export default reportsSlice.reducer;