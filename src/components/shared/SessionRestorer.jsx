// src/components/SessionRestorer.jsx
// ─────────────────────────────────────────────────────────────────────────────
// This file lives at:  src/components/SessionRestorer.jsx
// useAuth lives at:    src/features/auth/hooks/useAuth.js
// Relative path:       ../features/auth/hooks/useAuth
// ─────────────────────────────────────────────────────────────────────────────
import { useAuth } from "../../hooks/useAuth";

/**
 * SessionRestorer
 *
 * Mounts useAuth (and its boot-check effect) at the very top of the React
 * tree — above <AppRoutes> — so `initializing` flips to false BEFORE any
 * ProtectedRoute evaluates.
 *
 * This is the ONLY place in the app that should call useAuth().
 * Every other component that just needs to read auth state should use:
 *   const { user } = useSelector((s) => s.auth);
 */
const SessionRestorer = () => {
  useAuth();
  return null;
};

export default SessionRestorer;