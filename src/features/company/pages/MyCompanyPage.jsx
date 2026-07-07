// src/features/company/pages/MyCompanyPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import { useMyCompany } from '../../../hooks/useCompany';
import { useCreateCompany } from '../../../hooks/useEditCompany';
import CompanyForm from '../components/CompanyForm';
import LogoUploader from '../components/LogoUploader';

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:  { label: 'Pending Review',  cls: 'status-pill-warning',  icon: '⏳', msg: 'Your company profile is under review by our admin team.' },
  verified: { label: 'Verified',        cls: 'status-pill-success',  icon: '✓',  msg: 'Your company is verified. You can now view applicant contact details.' },
  rejected: { label: 'Rejected',        cls: 'status-pill-danger',   icon: '✗',  msg: 'Your company was rejected. Update your details and contact support.' },
};

// ── Info row ──────────────────────────────────────────────────────────────────
const InfoRow = ({ icon, label, value }) => {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', padding: '0.65rem 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <div>
        <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
        <p style={{ margin: '0.1rem 0 0', fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>{value}</p>
      </div>
    </div>
  );
};

const MyCompanyPage = () => {
  const navigate = useNavigate();
  const { data: company, isLoading, isError, error } = useMyCompany();
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('success');

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const { mutate: createCompany, isPending: isCreating } = useCreateCompany({
    onSuccess: () => showToast('Company profile created! 🎉', 'success'),
    onError: (e) => showToast(e?.response?.data?.message || 'Failed to create company.', 'error'),
  });

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) return (
    <MainLayout>
      <div style={{ maxWidth: 680, margin: '3rem auto', padding: '0 1.5rem' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{
            height: 70,
            borderRadius: '0.75rem',
            background: 'var(--bg-elevated)',
            marginBottom: '0.75rem',
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
        ))}
      </div>
    </MainLayout>
  );

  // ── First time: create form ───────────────────────────────────────────────
  const isNotFound = isError && error?.response?.status === 404;
  if (isNotFound) {
    return (
      <MainLayout>
        <div style={{ maxWidth: 680, margin: '2.5rem auto', padding: '0 1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Create Company Profile
            </h2>
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Set up your company profile to start hiring on HireMe.
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <CompanyForm
              onSubmit={(payload) => createCompany(payload)}
              isSubmitting={isCreating}
              submitLabel="Create Company"
              mode="create"
            />
          </div>
        </div>

        {toastMsg && <Toast msg={toastMsg} type={toastType} onDismiss={() => setToastMsg(null)} />}
      </MainLayout>
    );
  }

  if (isError) return (
    <MainLayout>
      <div style={{ maxWidth: 680, margin: '3rem auto', padding: '0 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Something went wrong loading your company. Please try again.
      </div>
    </MainLayout>
  );

  // ── Company exists ────────────────────────────────────────────────────────
  const status = STATUS_CONFIG[company.verificationStatus] ?? STATUS_CONFIG.pending;

  return (
    <MainLayout>
      <div style={{ maxWidth: 760, margin: '2.5rem auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              My Company
            </h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Manage your company profile and verification status
            </p>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/company/edit')}
          >
            ✏️ Edit Profile
          </button>
        </div>

        {/* Status banner */}
        <div style={{
          padding: '0.875rem 1.1rem',
          borderRadius: '0.875rem',
          background: company.verificationStatus === 'verified'
            ? 'rgba(47,212,126,0.07)'
            : company.verificationStatus === 'rejected'
              ? 'rgba(240,96,90,0.07)'
              : 'rgba(240,169,58,0.07)',
          border: `1px solid ${
            company.verificationStatus === 'verified'
              ? 'rgba(47,212,126,0.22)'
              : company.verificationStatus === 'rejected'
                ? 'rgba(240,96,90,0.22)'
                : 'rgba(240,169,58,0.22)'
          }`,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          <span className={`status-pill ${status.cls}`}>{status.label}</span>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{status.msg}</p>
        </div>

        {/* Rejection reason */}
        {company.verificationStatus === 'rejected' && company.rejectionReason && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            background: 'rgba(240,96,90,0.06)',
            border: '1px solid rgba(240,96,90,0.18)',
            fontSize: '0.82rem',
            color: 'var(--danger)',
          }}>
            <strong>Rejection reason:</strong> {company.rejectionReason}
          </div>
        )}

        {/* Main card */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', minWidth: 100 }}>
            <div style={{
              width: 90,
              height: 90,
              borderRadius: '1rem',
              border: '1px solid var(--border)',
              background: 'var(--bg-elevated)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
              {company.logo?.url
                ? <img src={company.logo.url} alt={company.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                : <span style={{ fontSize: '2.2rem' }}>🏢</span>
              }
            </div>
            {company.slug && (
              <button
                className="btn btn-ghost"
                style={{ fontSize: '0.72rem', padding: '0.3rem 0.7rem' }}
                onClick={() => navigate(`/company/${company.slug}`)}
              >
                View Public Page →
              </button>
            )}
          </div>

          {/* Details */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <h3 style={{ margin: '0 0 0.15rem', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {company.name}
            </h3>
            {company.industry && (
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                {company.industry}
              </p>
            )}
            {company.description && (
              <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {company.description}
              </p>
            )}
            <InfoRow icon="📍" label="Location" value={[company.location?.city, company.location?.state, company.location?.country].filter(Boolean).join(', ')} />
            <InfoRow icon="👥" label="Company Size" value={company.size ? `${company.size} employees` : null} />
            <InfoRow icon="🗓" label="Founded" value={company.foundedYear?.toString()} />
            <InfoRow icon="🌐" label="Website" value={company.website} />
          </div>
        </div>

        {/* Contact & Social */}
        {(company.contact?.email || company.contact?.phone || company.social?.linkedin || company.social?.twitter) && (
          <div className="card" style={{ padding: '1.25rem' }}>
            <h4 style={{ margin: '0 0 0.875rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Contact & Social
            </h4>
            <InfoRow icon="✉️" label="Email" value={company.contact?.email} />
            <InfoRow icon="📞" label="Phone" value={company.contact?.phone} />
            <InfoRow icon="💼" label="LinkedIn" value={company.social?.linkedin} />
            <InfoRow icon="🐦" label="Twitter" value={company.social?.twitter} />
          </div>
        )}

      </div>

      {toastMsg && <Toast msg={toastMsg} type={toastType} onDismiss={() => setToastMsg(null)} />}
    </MainLayout>
  );
};

// ── Inline Toast ──────────────────────────────────────────────────────────────
const Toast = ({ msg, type, onDismiss }) => (
  <div
    onClick={onDismiss}
    style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      padding: '0.875rem 1.25rem',
      borderRadius: '0.875rem',
      background: type === 'error' ? 'rgba(240,96,90,0.12)' : 'rgba(47,212,126,0.12)',
      border: `1px solid ${type === 'error' ? 'rgba(240,96,90,0.3)' : 'rgba(47,212,126,0.3)'}`,
      color: type === 'error' ? 'var(--danger)' : 'var(--success)',
      fontSize: '0.85rem',
      fontWeight: 600,
      cursor: 'pointer',
      zIndex: 9999,
      maxWidth: 340,
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      animation: 'fade-up 0.3s ease both',
    }}
  >
    {msg}
  </div>
);

export default MyCompanyPage;