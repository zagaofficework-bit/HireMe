// src/components/shared/Navbar.jsx
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import ProfileDropdownMenu from './ProfileDropdownMenu';
import NotificationBell from '../../features/notification/components/NotificationBell';

const NAV_LINKS = [
  { label: 'Explore', path: '/search' },
  { label: 'Categories', path: '/categories' },
  { label: 'Enterprise', path: '/enterprise' },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { user } = useSelector((s) => s.auth);

  return (
    <nav className="sticky top-0 z-50 w-full bg-[var(--bg-panel)]/90 backdrop-blur-md border-b border-[var(--accent)]/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ✅ Navbar height increased to fit bigger logo */}
        <div className="flex items-center justify-between h-20">

          {/* ── Logo ───────────────── */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Mobile hamburger */}
            <button
              className="md:hidden mr-1 p-1 text-[var(--text-secondary)]"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>

            {/* ✅ Logo enlarged */}
            <Link to="/" className="flex items-center">
              <img
                src="/Hyrd logo.png"   // ✅ correct path
                alt="Hyrd Logo"
                className="h-17 sm:h-[74px] w-auto object-contain"  // ✅ bigger, still responsive
              />
            </Link>
          </div>

          {/* ── Desktop nav links ───────────────── */}
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

            {/* Search mobile */}
            <button
              className="sm:hidden p-2 text-[var(--text-muted)]"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Search desktop */}
            <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--accent)]/15 bg-[var(--bg-page)] text-sm text-[var(--text-muted)]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden lg:inline">Search</span>
            </button>

            {user && <NotificationBell />}
            <ThemeToggle />

            {user ? (
              <ProfileDropdownMenu />
            ) : (
              <>
                <Link to="/login" className="hidden sm:block text-sm px-3 py-1.5">
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-semibold px-4 py-2 rounded-xl bg-[var(--accent)] text-[#061c1e]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <div className="sm:hidden pb-3">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-3 py-2 rounded-lg border"
            />
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-3 space-y-1">
            {NAV_LINKS.map(({ label, path }) => (
              <Link
                key={label}
                to={path}
                className="block px-4 py-2"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;