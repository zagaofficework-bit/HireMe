import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#061c1e]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#29c8d6]/10 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              className="md:hidden mr-1 p-1 text-slate-600 dark:text-slate-300"
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
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#29c8d6] to-[#105056] flex items-center justify-center shadow-lg shadow-[#29c8d6]/20 group-hover:shadow-[#29c8d6]/40 transition-shadow duration-300">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </span>
              <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white font-[Syne,sans-serif]">
                Freelance<span className="text-[#29c8d6]">Hub</span>
              </span>
            </a>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {['Explore', 'Services', 'Enterprise'].map((item) => (
              <a
                key={item}
                href="#"
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#29c8d6] dark:hover:text-[#29c8d6] transition-colors duration-200 rounded-lg hover:bg-[#29c8d6]/5"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search toggle (mobile) */}
            <button
              className="sm:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-[#29c8d6] transition-colors"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Search (desktop) */}
            <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#29c8d6]/15 text-sm text-slate-400 dark:text-slate-500 hover:border-[#29c8d6]/40 hover:text-[#29c8d6] transition-all duration-200 bg-slate-50 dark:bg-[#0a2a2e]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden lg:inline">Search</span>
            </button>

            <ThemeToggle />

            <a
              href="#"
              className="hidden sm:block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#29c8d6] transition-colors px-3 py-1.5"
            >
              Log In
            </a>
            <a
              href="#"
              className="text-sm font-semibold px-4 py-2 rounded-xl bg-[#29c8d6] hover:bg-[#1fb8c5] text-[#061c1e] shadow-lg shadow-[#29c8d6]/20 hover:shadow-[#29c8d6]/40 transition-all duration-200 hover:-translate-y-0.5"
            >
              Sign Up
            </a>
          </div>
        </div>

        {/* Mobile search bar */}
        {searchOpen && (
          <div className="sm:hidden pb-3 pt-1">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#29c8d6]/20 bg-slate-50 dark:bg-[#0a2a2e]">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                autoFocus
                type="text"
                placeholder="Search talent..."
                className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 outline-none"
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-[#29c8d6]/10 py-3 space-y-1">
            {['Explore', 'Services', 'Enterprise'].map((item) => (
              <a
                key={item}
                href="#"
                className="block px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#29c8d6] hover:bg-[#29c8d6]/5 rounded-lg transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="pt-2 border-t border-slate-200 dark:border-[#29c8d6]/10 mt-2">
              <a href="#" className="block px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#29c8d6] hover:bg-[#29c8d6]/5 rounded-lg transition-colors">
                Log In
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;