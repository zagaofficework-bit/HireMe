import { useState } from "react";
import MainLayout from "../../../layouts/MainLayout";
import AdminSidebar from "../components/AdminSidebar";
import UserRow from "../components/UserRow";
import { useAdminUsers, useBanUser, useUnbanUser, useSuspendUser, useUnsuspendUser } from "../../../hooks/useAdmin";

const roleTabs = [
  { value: "", label: "All" },
  { value: "user", label: "Freelancers" },
  { value: "client", label: "Clients" },
  { value: "admin", label: "Admins" },
];

const AdminUsersPage = () => {
  const [filters, setFilters] = useState({ role: "", status: "", search: "", page: 1, limit: 20 });
  const [reasonModal, setReasonModal] = useState(null);
  const [reasonText, setReasonText] = useState("");

  const { data, isLoading } = useAdminUsers(filters);
  const banMutation = useBanUser();
  const unbanMutation = useUnbanUser();
  const suspendMutation = useSuspendUser();
  const unsuspendMutation = useUnsuspendUser();

  const updateFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value, page: 1 }));

  const openReasonModal = (type, userId) => {
    setReasonText("");
    setReasonModal({ type, userId });
  };

  const submitReason = () => {
    if (reasonText.trim().length < 10) return;
    if (reasonModal.type === "ban") {
      banMutation.mutate({ id: reasonModal.userId, banReason: reasonText.trim() });
    } else {
      suspendMutation.mutate({ id: reasonModal.userId, reason: reasonText.trim() });
    }
    setReasonModal(null);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-6">
        <AdminSidebar />

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold font-display text-[var(--text-primary)] mb-6">Users</h1>

          <div className="card flex flex-wrap gap-2 mb-3">
            {roleTabs.map((tab) => (
              <button
                key={tab.value || "all"}
                onClick={() => updateFilter("role", tab.value)}
                className={`btn ${filters.role === tab.value ? "btn-primary" : "btn-secondary"} px-3 py-1.5 text-xs`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="card flex flex-wrap gap-3 mb-5">
            <input
              type="text"
              placeholder="Search name or email…"
              className="theme-input rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px]"
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
            />
            <select
              className="theme-input rounded-lg px-3 py-2 text-sm"
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="card p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className="py-3 px-4 text-xs font-semibold uppercase text-[var(--text-muted)]">User</th>
                  <th className="py-3 px-4 text-xs font-semibold uppercase text-[var(--text-muted)]">Role</th>
                  <th className="py-3 px-4 text-xs font-semibold uppercase text-[var(--text-muted)]">Status</th>
                  <th className="py-3 px-4 text-xs font-semibold uppercase text-[var(--text-muted)]">Joined</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr><td colSpan={5} className="py-6 text-center text-[var(--text-muted)]">Loading…</td></tr>
                )}
                {data?.users?.map((user) => (
                  <UserRow
                    key={user._id}
                    user={user}
                    onBan={(id) => openReasonModal("ban", id)}
                    onUnban={(id) => unbanMutation.mutate(id)}
                    onSuspend={(id) => openReasonModal("suspend", id)}
                    onUnsuspend={(id) => unsuspendMutation.mutate(id)}
                  />
                ))}
                {data?.users?.length === 0 && (
                  <tr><td colSpan={5} className="py-6 text-center text-[var(--text-muted)]">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {data?.pagination && (
            <div className="flex items-center justify-between mt-4 text-sm text-[var(--text-secondary)]">
              <span>Page {data.pagination.page} of {data.pagination.pages} ({data.pagination.total} total)</span>
              <div className="flex gap-2">
                <button disabled={filters.page <= 1} onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))} className="btn btn-secondary px-3 py-1.5 text-xs">Prev</button>
                <button disabled={filters.page >= data.pagination.pages} onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))} className="btn btn-secondary px-3 py-1.5 text-xs">Next</button>
              </div>
            </div>
          )}
        </div>

        {reasonModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="card w-full max-w-md">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                {reasonModal.type === "ban" ? "Ban user" : "Suspend user"}
              </h3>
              <textarea
                autoFocus
                rows={4}
                placeholder="Reason (min 10 characters)…"
                className="theme-input rounded-lg px-3 py-2 text-sm w-full resize-none"
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
              />
              {reasonText.trim().length > 0 && reasonText.trim().length < 10 && (
                <p className="text-xs text-[var(--danger)] mt-1">Reason must be at least 10 characters.</p>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setReasonModal(null)} className="btn btn-ghost px-4 py-2 text-sm">Cancel</button>
                <button onClick={submitReason} disabled={reasonText.trim().length < 10} className="btn btn-primary px-4 py-2 text-sm">Confirm</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AdminUsersPage;