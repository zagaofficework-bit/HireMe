import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import {
  useAdminUserDetail,
  useBanUser,
  useUnbanUser,
  useSuspendUser,
  useUnsuspendUser,
  useApproveProfile,
  useRejectProfile,
} from "../../../hooks/useAdmin";

// Pill colours keyed to approvalStatus values
const APPROVAL_PILL = {
  pending:  "status-pill-warning",
  approved: "status-pill-success",
  rejected: "status-pill-danger",
};

const AdminUserDetail = () => {
  const { id } = useParams();
  const { data, isLoading } = useAdminUserDetail(id);

  const banMutation       = useBanUser();
  const unbanMutation     = useUnbanUser();
  const suspendMutation   = useSuspendUser();
  const unsuspendMutation = useUnsuspendUser();
  const approveMutation   = useApproveProfile();
  const rejectMutation    = useRejectProfile();

  // Shared modal for ban / suspend / profile-reject — all need a reason
  const [modalType, setModalType]   = useState(null); // 'ban' | 'suspend' | 'rejectProfile'
  const [reasonText, setReasonText] = useState("");

  const openModal  = (type) => { setModalType(type); setReasonText(""); };
  const closeModal = () => setModalType(null);

  const submitReason = () => {
    if (reasonText.trim().length < 10) return;
    if (modalType === "ban")           banMutation.mutate({ id, banReason: reasonText.trim() });
    if (modalType === "suspend")       suspendMutation.mutate({ id, reason: reasonText.trim() });
    if (modalType === "rejectProfile") rejectMutation.mutate({ id: data.profile._id, reason: reasonText.trim() });
    closeModal();
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-[var(--text-muted)]">
        Loading…
      </div>
    );
  }

  const { user, profile, company } = data || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-6">
      <AdminSidebar />

      <div className="flex-1 min-w-0 space-y-6">
        <Link to="/admin/users" className="text-sm text-[var(--accent)] hover:underline">
          ← Back to users
        </Link>

        {/* ── User card ── */}
        {user && (
          <div className="card">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-xl font-bold text-[var(--text-primary)]">{user.name}</h1>
                <p className="text-sm text-[var(--text-muted)]">{user.email}</p>
                <div className="flex gap-2 mt-2">
                  <span className="badge badge-info">{user.role}</span>
                  <span
                    className={`status-pill ${
                      user.status === "active"
                        ? "status-pill-success"
                        : user.status === "banned"
                        ? "status-pill-danger"
                        : "status-pill-warning"
                    }`}
                  >
                    {user.status}
                  </span>
                </div>
                {user.banReason && (
                  <p className="text-xs text-[var(--danger)] mt-2">Ban reason: {user.banReason}</p>
                )}
              </div>

              {user.role !== "admin" && (
                <div className="flex gap-2">
                  {user.status === "banned" ? (
                    <button onClick={() => unbanMutation.mutate(id)} className="btn btn-secondary text-sm">
                      Unban
                    </button>
                  ) : (
                    <button onClick={() => openModal("ban")} className="btn btn-ghost text-sm text-[var(--danger)]">
                      Ban
                    </button>
                  )}
                  {user.status === "suspended" ? (
                    <button onClick={() => unsuspendMutation.mutate(id)} className="btn btn-secondary text-sm">
                      Unsuspend
                    </button>
                  ) : (
                    user.status !== "banned" && (
                      <button onClick={() => openModal("suspend")} className="btn btn-ghost text-sm text-[var(--warning)]">
                        Suspend
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Profile card (with approval flow) ── */}
        {profile && (
          <div className="card">
            <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
              <h2 className="font-semibold text-[var(--text-primary)]">Profile</h2>

              <div className="flex items-center gap-2">
                {profile.approvalStatus && (
                  <span className={`status-pill ${APPROVAL_PILL[profile.approvalStatus] ?? ""}`}>
                    {profile.approvalStatus}
                  </span>
                )}

                {/* Approve — show when pending or rejected */}
                {(profile.approvalStatus === "pending" || profile.approvalStatus === "rejected") && (
                  <button
                    onClick={() => approveMutation.mutate(profile._id)}
                    disabled={approveMutation.isPending}
                    className="btn btn-primary text-sm px-3 py-1.5"
                  >
                    {approveMutation.isPending ? "Approving…" : "Approve"}
                  </button>
                )}

                {/* Reject — show when pending or approved */}
                {(profile.approvalStatus === "pending" || profile.approvalStatus === "approved") && (
                  <button
                    onClick={() => openModal("rejectProfile")}
                    disabled={rejectMutation.isPending}
                    className="btn btn-ghost text-sm text-[var(--danger)] px-3 py-1.5"
                  >
                    Reject
                  </button>
                )}

                {profile.approvalStatus === "approved" && (
                  <span className="text-xs text-[var(--text-muted)]">(visible to clients)</span>
                )}
              </div>
            </div>

            {profile.approvalStatus === "rejected" && profile.rejectionReason && (
              <p className="text-xs text-[var(--danger)] mb-3">
                Rejection reason: {profile.rejectionReason}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 text-sm text-[var(--text-secondary)]">
              <p>Category: {profile.category?.name || "—"}</p>
              <p>Verified: {profile.isVerified ? "Yes" : "No"}</p>
              <p>Featured: {profile.isFeatured ? "Yes" : "No"}</p>
              <p>Visible: {profile.isVisible ? "Yes" : "No"}</p>
              <p>Completion: {profile.completionPercentage ?? 0}%</p>
              <p>Rating: {profile.averageRating ?? "—"} ({profile.totalReviews ?? 0} reviews)</p>
            </div>
          </div>
        )}

        {!profile && !isLoading && (
          <div className="card text-sm text-[var(--text-muted)]">
            This user hasn't created a profile yet.
          </div>
        )}

        {/* ── Company card ── */}
        {company && (
          <div className="card">
            <h2 className="font-semibold text-[var(--text-primary)] mb-3">Company</h2>
            <div className="grid grid-cols-2 gap-3 text-sm text-[var(--text-secondary)]">
              <p>Name: {company.name}</p>
              <p>Status: {company.verificationStatus}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Shared reason modal ── */}
      {modalType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="card w-full max-w-md">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              {modalType === "ban"           && "Ban user"}
              {modalType === "suspend"       && "Suspend user"}
              {modalType === "rejectProfile" && "Reject profile"}
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
              <p className="text-xs text-[var(--danger)] mt-1">
                Reason must be at least 10 characters.
              </p>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={closeModal} className="btn btn-ghost px-4 py-2 text-sm">
                Cancel
              </button>
              <button
                onClick={submitReason}
                disabled={reasonText.trim().length < 10}
                className="btn btn-primary px-4 py-2 text-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserDetail;