// src/routes/GuestRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * GuestRoute
 *
 * Reads auth state directly from Redux — does NOT call useAuth() — so it
 * never triggers a second boot-check effect. Session restoration is owned
 * exclusively by <SessionRestorer /> in App.jsx.
 *
 * Wraps auth-only pages (login, signup, otp, complete-profile).
 *  - initializing → render null (invisible wait, avoids flash before session restored)
 *  - authenticated + isNewUser → /complete-profile
 *  - authenticated             → /  (already logged in, nothing to do here)
 *  - not authenticated         → <Outlet /> (render the guest page)
 */
const GuestRoute = () => {
  const { user, initializing, isNewUser } = useSelector((s) => s.auth);

  // Wait silently — <SessionRestorer /> is already showing nothing meaningful
  // at this point (it renders null), so a blank guest area is fine here too.
  if (initializing) return null;

  if (user) {
    if (isNewUser) return <Navigate to="/complete-profile" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;