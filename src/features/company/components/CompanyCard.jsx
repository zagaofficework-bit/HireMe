// src/features/company/components/CompanyCard.jsx
import { useNavigate } from 'react-router-dom';

const STATUS_CONFIG = {
  verified: { label: 'Verified', cls: 'status-pill-success' },
  pending:  { label: 'Pending',  cls: 'status-pill-warning' },
  rejected: { label: 'Rejected', cls: 'status-pill-danger' },
};

const CompanyCard = ({ company, showStatus = false, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) { onClick(company); return; }
    if (company.slug) navigate(`/company/${company.slug}`);
  };

  const status = STATUS_CONFIG[company.verificationStatus] ?? STATUS_CONFIG.pending;

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s, transform 0.2s',
        padding: '1.25rem',
      }}
      onClick={handleClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.18)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '';
        e.currentTarget.style.transform = '';
      }}
    >
      {/* Logo */}
      <div style={{
        width: 52,
        height: 52,
        borderRadius: '0.75rem',
        border: '1px solid var(--border)',
        background: 'var(--bg-elevated)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {company.logo?.url ? (
          <img
            src={company.logo.url}
            alt={company.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : (
          <span style={{ fontSize: '1.4rem' }}>🏢</span>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <h3 style={{
            margin: 0,
            fontSize: '0.95rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {company.name}
          </h3>
          {showStatus && (
            <span className={`status-pill ${status.cls}`} style={{ fontSize: '0.65rem' }}>
              {status.label}
            </span>
          )}
        </div>

        {company.industry && (
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {company.industry}
          </p>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          {company.location?.city && (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              📍 {[company.location.city, company.location.country].filter(Boolean).join(', ')}
            </span>
          )}
          {company.size && (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              👥 {company.size} employees
            </span>
          )}
          {company.foundedYear && (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              🗓 Est. {company.foundedYear}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;