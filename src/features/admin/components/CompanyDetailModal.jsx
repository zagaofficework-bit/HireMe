import { useState } from "react";

const CompanyDetailModal = ({ company, onClose, onVerify, onReject, isVerifying, isRejecting }) => {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [reason, setReason] = useState("");

  if (!company) return null;
  const status = company.verificationStatus;

  const submitReject = () => {
    if (reason.trim().length < 10) return;
    onReject(company._id, reason.trim());
    setShowRejectForm(false);
    setReason("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="card w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-14 h-14 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center shrink-0 overflow-hidden">
              {company.logo?.url ? (
                <img src={company.logo.url} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[var(--accent)] font-bold text-lg">{company.name?.[0]?.toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-[var(--text-primary)] truncate">{company.name}</h2>
              <p className="text-xs text-[var(--text-muted)] truncate">{company.client?.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost px-2 py-1 text-sm shrink-0">✕</button>
        </div>

        <span
          className={`status-pill mb-4 inline-flex ${
            status === "verified" ? "status-pill-success" : status === "rejected" ? "status-pill-danger" : "status-pill-warning"
          }`}
        >
          {status}
        </span>

        {status === "rejected" && company.rejectionReason && (
          <p className="text-xs text-[var(--danger)] mb-3">Rejection reason: {company.rejectionReason}</p>
        )}

        {company.description && (
          <p className="text-sm text-[var(--text-secondary)] mb-4">{company.description}</p>
        )}

        <div className="grid grid-cols-2 gap-3 text-sm text-[var(--text-secondary)] mb-4">
          <p>Industry: {company.industry || "—"}</p>
          <p>Size: {company.size || "—"}</p>
          <p>Founded: {company.foundedYear || "—"}</p>
          <p>Website: {company.website || "—"}</p>
          <p>City: {company.location?.city || "—"}</p>
          <p>State: {company.location?.state || "—"}</p>
          <p>Country: {company.location?.country || "—"}</p>
          <p>Address: {company.location?.address || "—"}</p>
          <p>Contact email: {company.contact?.email || "—"}</p>
          <p>Contact phone: {company.contact?.phone || "—"}</p>
          <p>Created: {new Date(company.createdAt).toLocaleDateString()}</p>
          {company.verifiedAt && <p>Verified: {new Date(company.verifiedAt).toLocaleDateString()}</p>}
        </div>

        {showRejectForm ? (
          <div className="mb-2">
            <textarea
              autoFocus
              rows={3}
              placeholder="Reason (min 10 characters)…"
              className="theme-input rounded-lg px-3 py-2 text-sm w-full resize-none"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setShowRejectForm(false)} className="btn btn-ghost px-3 py-1.5 text-xs">
                Cancel
              </button>
              <button
                onClick={submitReject}
                disabled={reason.trim().length < 10 || isRejecting}
                className="btn btn-primary px-3 py-1.5 text-xs"
              >
                {isRejecting ? "Rejecting…" : "Confirm Reject"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end gap-2">
            {status !== "verified" && (
              <button onClick={() => onVerify(company._id)} disabled={isVerifying} className="btn btn-primary px-4 py-2 text-sm">
                {isVerifying ? "Verifying…" : "Verify"}
              </button>
            )}
            {status !== "rejected" && (
              <button onClick={() => setShowRejectForm(true)} className="btn btn-ghost px-4 py-2 text-sm text-[var(--danger)]">
                Reject
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetailModal;