// src/components/shared/Navbar.jsx
import { useState } from 'react';
import { useSelector } from 'react-redux';
import ThemeToggle from './ThemeToggle';
import ProfileDropdownMenu from './ProfileDropdownMenu';
import NotificationBell from '../../features/notification/components/NotificationBell';

const NAV_LINKS = ['Explore', 'Services', 'Enterprise'];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // ✅ Read directly from Redux — never call useAuth() here.
  //    useAuth() owns the boot-check effect; calling it in Navbar creates a
  //    second instance that can race with SessionRestorer and cause the
  //    initializing flag to misbehave, which triggers premature /login redirects.
  const { user } = useSelector((s) => s.auth);

  return (
    <nav
      className="sticky top-0 z-50 w-full
        bg-[var(--bg-panel)]/90 backdrop-blur-md
        border-b border-[var(--accent)]/10 shadow-sm
        transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ─────────────────────────────────────────────────── */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Mobile hamburger */}
            <button
              className="md:hidden mr-1 p-1 text-[var(--text-secondary)]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>

            <a href="/" className="flex items-center gap-1.5 group">
              <span
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--color-dark-teal-800,#105056)]
                  flex items-center justify-center
                  shadow-lg shadow-[var(--accent)]/20 group-hover:shadow-[var(--accent)]/40
                  transition-shadow duration-300"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </span>
              <span className="text-xl font-bold tracking-tight text-[var(--text-primary)] font-[Syne,sans-serif]">
                Hire<span className="text-[var(--accent)]">Me</span>
              </span>
            </a>
          </div>

          {/* ── Desktop nav links ─────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((item) => (
              <a
                key={item}
                href="#"
                className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)]
                  hover:text-[var(--accent)] transition-colors duration-200
                  rounded-lg hover:bg-[var(--accent)]/5"
              >
                {item}
              </a>
            ))}
          </div>

          {/* ── Right actions ─────────────────────────────────────────── */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search — mobile icon */}
            <button
              className="sm:hidden p-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Search — desktop pill */}
            <button
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg
                border border-[var(--accent)]/15 bg-[var(--bg-page)]
                text-sm text-[var(--text-muted)]
                hover:border-[var(--accent)]/40 hover:text-[var(--accent)]
                transition-all duration-200"
            >
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
                <a
                  href="/login"
                  className="hidden sm:block text-sm font-medium text-[var(--text-secondary)]
                    hover:text-[var(--accent)] transition-colors px-3 py-1.5"
                >
                  Log In
                </a>
                <a
                  href="/signup"
                  className="text-sm font-semibold px-4 py-2 rounded-xl
                    bg-[var(--accent)] hover:bg-[var(--accent-hover,#1fb8c5)]
                    text-[#061c1e]
                    shadow-lg shadow-[var(--accent)]/20 hover:shadow-[var(--accent)]/40
                    transition-all duration-200 hover:-translate-y-0.5"
                >
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>

        {/* Mobile search bar */}
        {searchOpen && (
          <div className="sm:hidden pb-3 pt-1">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl
                border border-[var(--accent)]/20 bg-[var(--bg-page)]"
            >
              <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                autoFocus
                type="text"
                placeholder="Search talent…"
                className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none"
              />
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[var(--accent)]/10 py-3 space-y-1">
            {NAV_LINKS.map((item) => (
              <a
                key={item}
                href="#"
                className="block px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)]
                  hover:text-[var(--accent)] hover:bg-[var(--accent)]/5
                  rounded-lg transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            {!user && (
              <div className="pt-2 border-t border-[var(--accent)]/10 mt-2">
                <a
                  href="/login"
                  className="block px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)]
                    hover:text-[var(--accent)] hover:bg-[var(--accent)]/5
                    rounded-lg transition-colors"
                >
                  Log In
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;