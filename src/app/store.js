// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/services/auth.slice';
import bookmarksReducer from '../features/bookmark/services/Bookmark.slice';
import notificationReducer from '../features/notification/services/notification.slice';
import reportsReducer from '../features/reports/services/reports.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bookmarks: bookmarksReducer,
    notification: notificationReducer,
    reports: reportsReducer,
  },
  devTools: import.meta.env.MODE !== 'production',
});

// ✅ Do NOT call injectStore() here.
// Call it in main.jsx AFTER the store is created and passed to <Provider>.