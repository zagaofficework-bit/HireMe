const statusPill = {
  verified: "status-pill-success",
  pending: "status-pill-warning",
  rejected: "status-pill-danger",
};

const CompanyRow = ({ company, onVerify, onReject }) => {
  const status = company.verificationStatus;

  return (
    <tr className="border-b border-[var(--border)] hover:bg-[var(--accent-soft)]/30 transition-colors">
      <td className="py-3 px-4">
        <p className="font-medium text-[var(--text-primary)]">{company.name}</p>
        <p className="text-xs text-[var(--text-muted)]">{company.client?.email}</p>
      </td>

      <td className="py-3 px-4 text-sm text-[var(--text-secondary)]">
        {company.industry || "—"}
      </td>

      <td className="py-3 px-4">
        <span className={`status-pill ${statusPill[status] || "status-pill-neutral"}`}>
          {status}
        </span>
      </td>

      <td className="py-3 px-4 text-sm text-[var(--text-secondary)]">
        {new Date(company.createdAt).toLocaleDateString()}
      </td>

      <td className="py-3 px-4">
        <div className="flex items-center gap-2 justify-end">
          {status !== "verified" && (
            <button onClick={() => onVerify(company._id)} className="btn btn-secondary px-3 py-1.5 text-xs">
              Verify
            </button>
          )}
          {status !== "rejected" && (
            <button onClick={() => onReject(company._id)} className="btn btn-ghost px-3 py-1.5 text-xs text-[var(--danger)]">
              Reject
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default CompanyRow;