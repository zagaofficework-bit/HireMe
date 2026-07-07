// src/components/shared/ProfileDropdownMenu.jsx
//
// ⚠️  Do NOT call useAuth() here (same rule as Navbar).
//     useAuth() owns the boot-check effect; calling it in any shared component
//     that mounts with the layout creates a second instance that races with
//     SessionRestorer and can trigger premature /login redirects.
//     Read state directly from Redux and dispatch logout the same way.
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../features/auth/services/auth.slice';
import { logoutApi } from '../../api/auth.api';

const MENU_BY_ROLE = {
  user: [
    { to: '/profile/me',   label: 'My Profile'    },
    { to: '/profile/edit', label: 'Edit Profile'  },
    { to: '/settings',     label: 'Settings'      },
  ],
  client: [
    { to: '/company/dashboard', label: 'Dashboard'        },
    { to: '/company/me',       label: 'Company Profile'  },
    { to: '/company/bookmarks',        label: 'Bookmarks'        },
    { to: '/company/settings',         label: 'Settings'         },
  ],
  admin: [
    { to: '/admin',    label: 'Admin Panel' },
    { to: '/settings', label: 'Settings'    },
  ],
};

const ProfileDropdownMenu = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user }  = useSelector((s) => s.auth);

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!user) return null;

  const links   = MENU_BY_ROLE[user.role] ?? MENU_BY_ROLE.user;
  const initial = user.name?.charAt(0)?.toUpperCase() ?? '?';

  const handleLogout = async () => {
    setOpen(false);
    try {
      await logoutApi();          // tell the backend to clear the cookie/session
    } catch {
      // ignore — we still clear local state even if the request fails
    }
    dispatch(logoutUser());       // clear Redux + localStorage token
    navigate('/login');
  };

  return (
    <div className="relative" ref={ref}>
      {/* ── Trigger button ──────────────────────────────────────────── */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full
          border border-[var(--border)] hover:border-[var(--accent)]/40
          transition-colors"
        aria-label="Account menu"
      >
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <span
            className="w-8 h-8 rounded-full bg-[var(--accent-soft)] text-[var(--accent)]
              flex items-center justify-center text-sm font-bold"
          >
            {initial}
          </span>
        )}
        <svg
          className={`w-3.5 h-3.5 text-[var(--text-muted)] transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* ── Dropdown panel ──────────────────────────────────────────── */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--border)]
            bg-[var(--bg-panel)] shadow-xl py-2 z-50 animate-fade-up"
        >
          {/* User info header */}
          <div className="px-4 py-2 border-b border-[var(--border)]">
            <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{user.name}</p>
            <p className="text-xs text-[var(--text-muted)] truncate">{user.email}</p>
            <span className="badge badge-accent mt-1.5">{user.role}</span>
          </div>

          {/* Nav links */}
          <div className="py-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-[var(--text-secondary)]
                  hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Logout */}
          <div className="border-t border-[var(--border)] pt-1">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-[var(--danger)]
                hover:bg-[rgba(240,96,90,0.08)] transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdownMenu;