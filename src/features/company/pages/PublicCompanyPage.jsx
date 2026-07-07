// src/features/company/pages/PublicCompanyPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import { usePublicCompany } from '../../../hooks/useCompany';

// ── Info section ──────────────────────────────────────────────────────────────
const InfoItem = ({ icon, label, value, href }) => {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.7rem 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: '1rem', marginTop: 2, flexShrink: 0 }}>{icon}</span>
      <div>
        <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent)', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}
          >
            {value}
          </a>
        ) : (
          <p style={{ margin: '0.1rem 0 0', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>{value}</p>
        )}
      </div>
    </div>
  );
};

const PublicCompanyPage = () => {
  const { slug } = useParams();
  const navigate  = useNavigate();
  const { data: company, isLoading, isError, error } = usePublicCompany(slug);

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (isLoading) return (
    <MainLayout>
      <div style={{ maxWidth: 820, margin: '3rem auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ height: 180, borderRadius: '1rem', background: 'var(--bg-elevated)', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: 120, borderRadius: '1rem', background: 'var(--bg-elevated)', animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
    </MainLayout>
  );

  if (isError) {
    const is404 = error?.response?.status === 404;
    return (
      <MainLayout>
        <div style={{ maxWidth: 500, margin: '5rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏢</p>
          <h2 style={{ margin: '0 0 0.5rem', color: 'var(--text-primary)', fontWeight: 800 }}>
            {is404 ? 'Company not found' : 'Something went wrong'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            {is404 ? "This company page doesn't exist or may have been removed." : 'Failed to load company. Please try again.'}
          </p>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            ← Go back
          </button>
        </div>
      </MainLayout>
    );
  }

  const locationStr = [company.location?.city, company.location?.state, company.location?.country]
    .filter(Boolean).join(', ');

  return (
    <MainLayout>
      <div style={{ maxWidth: 820, margin: '2.5rem auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Hero card */}
        <div className="card" style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Logo */}
          <div style={{
            width: 84,
            height: 84,
            borderRadius: '1rem',
            border: '1px solid var(--border)',
            background: 'var(--bg-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0,
          }}>
            {company.logo?.url
              ? <img src={company.logo.url} alt={company.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              : <span style={{ fontSize: '2rem' }}>🏢</span>
            }
          </div>

          {/* Header info */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
              <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {company.name}
              </h1>
              {company.verificationStatus === 'verified' && (
                <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>✓ Verified</span>
              )}
            </div>

            {company.industry && (
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {company.industry}
              </p>
            )}

            {/* Meta pills */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {locationStr && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  📍 {locationStr}
                </span>
              )}
              {company.size && (
                <span style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: 9999,
                  background: 'var(--accent-soft)',
                  color: 'var(--accent)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                }}>
                  👥 {company.size} employees
                </span>
              )}
              {company.foundedYear && (
                <span style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: 9999,
                  background: 'var(--bg-elevated)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  border: '1px solid var(--border)',
                }}>
                  🗓 Est. {company.foundedYear}
                </span>
              )}
            </div>
          </div>

          {/* Website CTA */}
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ textDecoration: 'none', flexShrink: 0 }}
            >
              🌐 Visit Website
            </a>
          )}
        </div>

        {/* About */}
        {company.description && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ margin: '0 0 0.875rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              About
            </h2>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {company.description}
            </p>
          </div>
        )}

        {/* Details grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

          {/* Company details */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Details
            </h2>
            <InfoItem icon="📍" label="Location" value={locationStr} />
            <InfoItem icon="👥" label="Company Size" value={company.size ? `${company.size} employees` : null} />
            <InfoItem icon="🗓" label="Founded" value={company.foundedYear?.toString()} />
            <InfoItem icon="🌐" label="Website" value={company.website} href={company.website} />
          </div>

          {/* Social links */}
          {(company.social?.linkedin || company.social?.twitter) && (
            <div className="card" style={{ padding: '1.25rem' }}>
              <h2 style={{ margin: '0 0 0.5rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Social
              </h2>
              <InfoItem icon="💼" label="LinkedIn" value={company.social?.linkedin ? 'LinkedIn Profile' : null} href={company.social?.linkedin} />
              <InfoItem icon="🐦" label="Twitter / X" value={company.social?.twitter ? 'Twitter Profile' : null} href={company.social?.twitter} />
            </div>
          )}
        </div>

        {/* Back button */}
        <div>
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>
            ← Go back
          </button>
        </div>

      </div>
    </MainLayout>
  );
};

export default PublicCompanyPage;