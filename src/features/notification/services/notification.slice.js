// src/features/notifications/store/notificationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    // Called from useNotifications whenever a fresh count/list comes back
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    // Optimistic decrement when a single notification is marked read
    decrementUnreadCount: (state) => {
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },
    resetUnreadCount: (state) => {
      state.unreadCount = 0;
    },
  },
});

export const {
  setUnreadCount,
  incrementUnreadCount,
  decrementUnreadCount,
  resetUnreadCount,
} = notificationSlice.actions;

export default notificationSlice.reducer;