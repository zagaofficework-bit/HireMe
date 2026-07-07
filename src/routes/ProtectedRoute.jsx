// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * ProtectedRoute
 *
 * KEY FIX: During `initializing`, render <Outlet /> — NOT a spinner.
 *
 * Why: If we render a <div> spinner here instead of <Outlet />, the child
 * route component never mounts. When initializing flips false and user=null
 * (e.g. session restore failed or token expired), we then navigate to /login.
 * But if initializing gets stuck or the timing is off, the catch-all `path="*"`
 * fires and sends the user to /404.
 *
 * The child page (MyProfilePage etc.) already has its own isLoading state from
 * React Query — it will show a spinner itself. ProtectedRoute's job is only to
 * GATE access, not to show a loading UI. Let the page handle its own loading.
 *
 * Guards (in order):
 *  1. initializing → <Outlet /> — wait silently, page handles its own loading
 *  2. no user      → /login     — preserve intended URL in location.state.from
 *  3. wrong role   → /unauthorized
 *  4. all good     → <Outlet />
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, initializing } = useSelector((s) => s.auth);
  const location = useLocation();

  // ── 1. Session restore in progress — render outlet, never redirect ────────
  // The child page has its own loading state via React Query. We just wait.
  if (initializing) return <Outlet />;

  // ── 2. Not authenticated ──────────────────────────────────────────────────
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ── 3. Wrong role ─────────────────────────────────────────────────────────
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ── 4. All good ───────────────────────────────────────────────────────────
  return <Outlet />;
};

export default ProtectedRoute;