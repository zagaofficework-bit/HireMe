// src/components/shared/Navbar.jsx
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import ProfileDropdownMenu from './ProfileDropdownMenu';
import NotificationBell from '../../features/notification/components/NotificationBell';
import { useTheme } from './ThemeContext'; // adjust path if your theme hook lives elsewhere

const NAV_LINKS = [
  { label: 'Explore', path: '/search' },
  { label: 'Categories', path: '/categories' },
  { label: 'Enterprise', path: '/enterprise' },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { user } = useSelector((s) => s.auth);
  const { theme } = useTheme();

  // Dark theme → black-background logo (hyrdlogo1). Light theme → white-background logo (hyrdlogo2).
  const logoSrc = theme === 'dark' ? '/hyrdlogo2.png' : '/hyrdlogo1.png';

  // Lock body scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Close drawer automatically if screen is resized to desktop width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-[var(--bg-panel)]/90 backdrop-blur-md border-b border-[var(--accent)]/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* ── Logo (left, always) ───────────────── */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img
                src={logoSrc}
                alt="Hyrd Logo"
                className="h-9 sm:h-14 md:h-16 lg:h-[74px] w-auto object-contain"
              />
            </Link>

            {/* ── Desktop nav links (center) ───────────────── */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ label, path }) => (
                <Link
                  key={label}
                  to={path}
                  className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)]
                  hover:text-[var(--accent)] transition rounded-lg hover:bg-[var(--accent)]/5"
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* ── Right actions ───────────────── */}
            <div className="flex items-center gap-2 sm:gap-3">

              {/* ---- Mobile-only icon cluster, in order: search → bell → theme → profile → hamburger ---- */}
              <button
                className="md:hidden p-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Toggle search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {user && (
                <div className="md:hidden">
                  <NotificationBell />
                </div>
              )}

              <div className="md:hidden">
                <ThemeToggle />
              </div>

              {user && (
                <div className="md:hidden">
                  <ProfileDropdownMenu />
                </div>
              )}

              <button
                className="md:hidden p-2 text-[var(--text-secondary)]"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* ---- Desktop-only actions ---- */}
              <button className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--accent)]/15 bg-[var(--bg-page)] text-sm text-[var(--text-muted)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden lg:inline">Search</span>
              </button>

              {user && (
                <div className="hidden md:block">
                  <NotificationBell />
                </div>
              )}

              <div className="hidden md:block">
                <ThemeToggle />
              </div>

              {user ? (
                <div className="hidden md:block">
                  <ProfileDropdownMenu />
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login" className="text-sm px-3 py-1.5">
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="text-sm font-semibold px-4 py-2 rounded-xl bg-[var(--accent)] text-[#061c1e]"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile search bar */}
          {searchOpen && (
            <div className="md:hidden pb-3">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-3 py-2 rounded-lg border border-[var(--accent)]/15 bg-[var(--bg-page)] text-sm
                focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
              />
            </div>
          )}
        </div>
      </nav>

      {/* ══════════════════ Mobile drawer + backdrop ══════════════════ */}
      {/* Rendered as siblings of <nav>, not inside it, so z-index/stacking always works */}

      <div
        className={`md:hidden fixed inset-0 z-[90] bg-black/60 transition-opacity duration-300
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMenuOpen(false)}
      />

      <aside
        className={`md:hidden fixed top-0 right-0 z-[100] h-screen w-[82%] max-w-xs
          bg-[var(--bg-panel)] shadow-2xl flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-[var(--accent)]/10 flex-shrink-0">
          <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center">
            <img src={logoSrc} alt="Hyrd Logo" className="h-9 w-auto object-contain" />
          </Link>
          <button
            className="p-2 text-[var(--text-secondary)]"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">

          {/* Profile block (logged in) */}
          {user && (
            <div className="flex items-center justify-between pb-5 mb-5 border-b border-[var(--accent)]/10">
              <ProfileDropdownMenu />
              <NotificationBell />
            </div>
          )}

          {/* Nav links */}
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(({ label, path }) => (
              <Link
                key={label}
                to={path}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-3 rounded-lg text-sm font-medium text-[var(--text-secondary)]
                hover:text-[var(--accent)] hover:bg-[var(--accent)]/5 transition"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth buttons (logged out) — Sign Up + Log In side by side */}
          {!user && (
            <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-[var(--accent)]/10">
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="text-center text-sm font-semibold px-3 py-2.5 rounded-xl bg-[var(--accent)] text-[#061c1e]"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-center text-sm font-medium px-3 py-2.5 rounded-xl border border-[var(--accent)]/20 text-[var(--text-secondary)]"
              >
                Log In
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Navbar;