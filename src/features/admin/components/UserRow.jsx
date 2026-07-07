import { Link } from "react-router-dom";

const roleLabel = { user: "Freelancer", client: "Client", admin: "Admin" };
const roleBadge = { user: "badge-info", client: "badge-accent", admin: "badge-warning" };

const statusPill = {
  active: "status-pill-success",
  banned: "status-pill-danger",
  suspended: "status-pill-warning",
};

const UserRow = ({ user, onBan, onUnban, onSuspend, onUnsuspend }) => {
  return (
    <tr className="border-b border-[var(--border)] hover:bg-[var(--accent-soft)]/30 transition-colors">
      <td className="py-3 px-4">
        <Link to={`/admin/users/${user._id}`} className="font-medium text-[var(--text-primary)] hover:text-[var(--accent)]">
          {user.name}
        </Link>
        <p className="text-xs text-[var(--text-muted)]">{user.email}</p>
      </td>

      <td className="py-3 px-4">
        <span className={`badge ${roleBadge[user.role] || "badge-info"}`}>{roleLabel[user.role] || user.role}</span>
      </td>

      <td className="py-3 px-4">
        <span className={`status-pill ${statusPill[user.status] || "status-pill-neutral"}`}>{user.status}</span>
      </td>

      <td className="py-3 px-4 text-sm text-[var(--text-secondary)]">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>

      <td className="py-3 px-4">
        <div className="flex items-center gap-2 justify-end">
          <Link to={`/admin/users/${user._id}`} className="btn btn-ghost px-3 py-1.5 text-xs">View</Link>
          {user.role !== "admin" && (
            <>
              {user.status === "banned" ? (
                <button onClick={() => onUnban(user._id)} className="btn btn-secondary px-3 py-1.5 text-xs">Unban</button>
              ) : (
                <button onClick={() => onBan(user._id)} className="btn btn-ghost px-3 py-1.5 text-xs text-[var(--danger)]">Ban</button>
              )}
              {user.status === "suspended" ? (
                <button onClick={() => onUnsuspend(user._id)} className="btn btn-secondary px-3 py-1.5 text-xs">Unsuspend</button>
              ) : (
                user.status !== "banned" && (
                  <button onClick={() => onSuspend(user._id)} className="btn btn-ghost px-3 py-1.5 text-xs text-[var(--warning)]">Suspend</button>
                )
              )}
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default UserRow;