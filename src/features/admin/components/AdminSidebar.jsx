import { NavLink } from "react-router-dom";

const links = [
  { to: "/admin", label: "Overview", exact: true },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/companies", label: "Companies" },
];

const AdminSidebar = () => {
  return (
    <aside className="w-60 shrink-0 hidden lg:block">
      <div className="card sticky top-20 p-3">
        <p className="px-3 pt-1 pb-3 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Admin Panel
        </p>
        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--accent-soft)]/50 hover:text-[var(--accent)]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;