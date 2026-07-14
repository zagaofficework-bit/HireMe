import { NavLink } from "react-router-dom";

const OverviewIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </svg>
);
const UsersIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      d="M17 21v-1.5a3.5 3.5 0 00-3.5-3.5h-5A3.5 3.5 0 005 19.5V21M9.5 12a3 3 0 100-6 3 3 0 000 6zM19 21v-1.5a3.5 3.5 0 00-2.4-3.32M15.5 5.16a3 3 0 010 5.68" />
  </svg>
);
const BuildingIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      d="M4 21V6l8-3 8 3v15M4 21h16M9 9h1M9 13h1M14 9h1M14 13h1M10 21v-4h4v4" />
  </svg>
);
const ArrowLeftIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const links = [
  { to: "/admin", label: "Overview", exact: true, icon: OverviewIcon },
  { to: "/admin/users", label: "Users", icon: UsersIcon },
  { to: "/admin/companies", label: "Companies", icon: BuildingIcon },
];

const AdminSidebar = () => {
  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="w-64 shrink-0 hidden lg:block">
        <div className="card sticky top-24 p-3 flex flex-col gap-4">
          <div className="flex items-center gap-2.5 px-2 pt-1">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
            >
              A
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[var(--text-primary)] leading-tight">Admin Panel</p>
              <p className="text-[10.5px] text-[var(--text-muted)] leading-tight">Platform control</p>
            </div>
          </div>

          <nav className="space-y-1">
            {links.map(({ to, label, exact, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--accent-soft)]/50 hover:text-[var(--accent)]"
                  }`
                }
              >
                <Icon className="flex-shrink-0" style={{ width: 18, height: 18 }} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="pt-2 border-t border-[var(--border)]">
            <NavLink
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)]/50 transition-colors"
            >
              <ArrowLeftIcon style={{ width: 18, height: 18 }} className="flex-shrink-0" />
              <span>Back to site</span>
            </NavLink>
          </div>
        </div>
      </aside>

      {/* ── Mobile nav strip — the aside above is desktop-only, so admins
         on a phone still need a way to switch between Overview/Users/
         Companies. Horizontal scroll of the same links, pill-active style
         to match the main Navbar's mobile pattern. ── */}
      <div className="lg:hidden -mx-4 sm:-mx-6 px-4 sm:px-6 mb-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {links.map(({ to, label, exact, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-[var(--accent)] text-[var(--accent-text)]"
                    : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)]"
                }`
              }
            >
              <Icon style={{ width: 14, height: 14 }} className="flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;