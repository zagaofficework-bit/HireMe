const statusPill = {
  verified: "status-pill-success",
  pending: "status-pill-warning",
  rejected: "status-pill-danger",
};

const CompanyCard = ({ company, onClick }) => {
  const status = company.verificationStatus;

  return (
    <button
      onClick={() => onClick(company)}
      className="card text-left w-full hover:border-[var(--accent)] transition-colors flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center shrink-0 overflow-hidden">
            {company.logo?.url ? (
              <img src={company.logo.url} alt={company.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[var(--accent)] font-bold">{company.name?.[0]?.toUpperCase()}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[var(--text-primary)] truncate">{company.name}</p>
            <p className="text-xs text-[var(--text-muted)] truncate">{company.client?.email}</p>
          </div>
        </div>
        <span className={`status-pill shrink-0 ${statusPill[status] || "status-pill-neutral"}`}>
          {status}
        </span>
      </div>

      <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
        {company.description || "No description provided."}
      </p>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--text-muted)]">
        <span>{company.industry || "Industry —"}</span>
        <span>{company.location?.city || "Location —"}</span>
        <span>{new Date(company.createdAt).toLocaleDateString()}</span>
      </div>
    </button>
  );
};

export default CompanyCard;