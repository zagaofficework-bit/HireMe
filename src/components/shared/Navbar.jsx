// src/components/shared/Navbar.jsx
//
// ⚠️  Do NOT call useAuth() here (same rule as ProfileDropdownMenu).
//     useAuth() owns the boot-check effect; calling it in any shared component
//     that mounts with the layout creates a second instance that races with
//     SessionRestorer and can trigger premature /login redirects.
//     Read state directly from Redux and dispatch logout the same way.
import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ThemeToggle from './ThemeToggle';
import ProfileDropdownMenu from './ProfileDropdownMenu';
import NotificationBell from '../../features/notification/components/NotificationBell';
import { useTheme } from './ThemeContext';
import { logoutUser } from '../../features/auth/services/auth.slice';
import { logoutApi } from '../../api/auth.api';

const NAV_LINKS = [
  { label: 'Explore', path: '/search' },
  { label: 'Categories', path: '/categories' },
  { label: 'Enterprise', path: '/enterprise' },
];

/* ── Drawer icons (stroke-based, match existing Navbar style) ─────────── */
const HomeIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      d="M3 10.5L12 3l9 7.5M5 9.5V21h5v-6h4v6h5V9.5" />
  </svg>
);
const AnalyticsIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </svg>
);
const BookmarkIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      d="M6 3h12v18l-6-4-6 4V3z" />
  </svg>
);
const SettingsIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
    <path stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);
const BellIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 01-3.46 0" />
  </svg>
);
const ProfileIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 4-6 8-6s8 2 8 6" />
  </svg>
);
const EditIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);
const StarIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
const CheckIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

/* ── Same per-role menu as ProfileDropdownMenu, with icons for the drawer ── */
const ROLE_NAV_ITEMS = {
  admin: [
    { to: '/admin/analytics',     label: 'Analytics',     icon: AnalyticsIcon },
    { to: '/admin',               label: 'Admin Panel',   icon: HomeIcon },
    { to: '/admin/notifications', label: 'Notifications', icon: BellIcon },
  ],
  client: [
    { to: '/company/dashboard',     label: 'Company Dashboard', icon: HomeIcon },
    { to: '/company/me',            label: 'Company Profile',   icon: ProfileIcon },
    { to: '/company/notifications', label: 'Notifications',     icon: BellIcon },
    { to: '/company/bookmarks',     label: 'Bookmarks',         icon: BookmarkIcon },
    { to: '/company/settings',      label: 'Settings',          icon: SettingsIcon },
  ],
  user: [
    { to: '/profile/me',            label: 'My Profile',   icon: ProfileIcon },
    { to: '/profile/edit',          label: 'Edit Profile', icon: EditIcon },
    { to: '/profile/notifications', label: 'Notification', icon: BellIcon },
    { to: '/profile/reviews',       label: 'Reviews',      icon: StarIcon },
    { to: '/settings',              label: 'Settings',     icon: SettingsIcon },
  ],
};

const ROLE_LABEL = { admin: 'Admin', client: 'Client', user: 'Freelancer' };

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((s) => s.auth);
  const { theme } = useTheme();

  const logoSrc = theme === 'dark' ? '/hyrdlogo2.png' : '/hyrdlogo1.png';
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? '?';
  const navItems = ROLE_NAV_ITEMS[user?.role] || [];
  const roleLabel = ROLE_LABEL[user?.role] || '';

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeDrawer = () => setMenuOpen(false);

  const handleLogout = async () => {
    closeDrawer();
    try {
      await logoutApi();
    } catch {
      // ignore — we still clear local state even if the request fails
    }
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-[var(--bg-panel)]/90 backdrop-blur-md border-b border-[var(--accent)]/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">

            <Link to="/" className="flex items-center flex-shrink-0">
              <img src={logoSrc} alt="Hyrd Logo" className="h-9 sm:h-14 md:h-16 lg:h-[74px] w-auto object-contain" />
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ label, path }) => (
                <Link key={label} to={path}
                  className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)]
                  hover:text-[var(--accent)] transition rounded-lg hover:bg-[var(--accent)]/5">
                  {label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">

              {/* ---- Mobile-only: theme toggle → hamburger (search removed) ---- */}
              <div className="md:hidden">
                <ThemeToggle />
              </div>

              <button
                className="md:hidden p-2 text-[var(--text-secondary)]"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* ---- Desktop-only actions (unchanged) ---- */}
              <button className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--accent)]/15 bg-[var(--bg-page)] text-sm text-[var(--text-muted)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden lg:inline">Search</span>
              </button>

              {user && <div className="hidden md:block"><NotificationBell /></div>}
              <div className="hidden md:block"><ThemeToggle /></div>

              {user ? (
                <div className="hidden md:block">
                  <ProfileDropdownMenu />
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login" className="text-sm px-3 py-1.5">Log In</Link>
                  <Link to="/signup" className="text-sm font-semibold px-4 py-2 rounded-xl bg-[var(--accent)] text-[var(--accent-text)]">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ══════════════════ Mobile drawer + backdrop ══════════════════ */}
      <div
        className={`md:hidden fixed inset-0 z-[90] bg-black/60 transition-opacity duration-300
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeDrawer}
      />

      <aside
        className={`md:hidden fixed top-0 right-0 z-[100] h-screen w-[82%] max-w-xs
          bg-[var(--bg-panel)] shadow-2xl flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Close button */}
        <div className="flex justify-end px-4 pt-4 flex-shrink-0">
          <button className="p-2 text-[var(--text-secondary)]" onClick={closeDrawer} aria-label="Close menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {user ? (
          <>
            {/* Profile block */}
            <div className="flex items-center gap-3 px-5 pb-5 border-b border-[var(--border)] flex-shrink-0">
              <div className="relative flex-shrink-0">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-[var(--accent)]/60 ring-offset-2 ring-offset-[var(--bg-panel)]"
                  />
                ) : (
                  <span className="w-14 h-14 rounded-full bg-[var(--accent-soft)] text-[var(--accent)]
                    flex items-center justify-center text-lg font-bold
                    ring-2 ring-[var(--accent)]/60 ring-offset-2 ring-offset-[var(--bg-panel)]">
                    {initial}
                  </span>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center ring-2 ring-[var(--bg-panel)]">
                  <CheckIcon className="w-3 h-3 text-[var(--accent-text)]" />
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-[var(--text-primary)] font-bold text-base truncate">{user.name}</p>
                <p className="text-[var(--text-muted)] text-xs mt-0.5">{roleLabel}</p>
              </div>
            </div>

            {/* Role-based nav — mirrors ProfileDropdownMenu's MENU_BY_ROLE */}
            <nav className="flex flex-col gap-1 px-3 py-4 overflow-y-auto scrollbar-thin">
              {navItems.map(({ to, label, icon: Icon }) => {
                const active = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={closeDrawer}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition
                      ${active
                        ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/5'}`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="mt-auto px-5 py-4 border-t border-[var(--border)] flex-shrink-0">
              <button
                onClick={handleLogout}
                className="btn btn-ghost w-full justify-center text-[var(--danger)]"
              >
                Log Out
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map(({ label, path }) => (
                  <Link key={label} to={path} onClick={closeDrawer}
                    className="px-3 py-3 rounded-lg text-sm font-medium text-[var(--text-secondary)]
                    hover:text-[var(--accent)] hover:bg-[var(--accent)]/5 transition">
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="grid grid-cols-2 gap-3 px-5 pb-6 pt-5 border-t border-[var(--border)] flex-shrink-0">
              <Link to="/signup" onClick={closeDrawer}
                className="text-center text-sm font-semibold px-3 py-2.5 rounded-xl bg-[var(--accent)] text-[var(--accent-text)]">
                Sign Up
              </Link>
              <Link to="/login" onClick={closeDrawer}
                className="text-center text-sm font-medium px-3 py-2.5 rounded-xl border border-[var(--accent)]/20 text-[var(--text-secondary)]">
                Log In
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default Navbar;