// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/services/auth.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;