// src/features/company/pages/EditCompanyPage.jsx
// Sidebar-nav layout matching EditProfilePage — sections: Logo, Info, Location, Contact, Social
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import { useMyCompany } from '../../../hooks/useCompany';
import { useUpdateCompany } from '../../../hooks/useEditCompany';
import LogoUploader from '../components/LogoUploader';

// ── Sections ──────────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'logo',     label: 'Company Logo',  icon: '🏢' },
  { id: 'basic',    label: 'Basic Info',    icon: '📋' },
  { id: 'location', label: 'Location',      icon: '📍' },
  { id: 'contact',  label: 'Contact',       icon: '✉️' },
  { id: 'social',   label: 'Social Links',  icon: '🔗' },
];

const INDUSTRIES = [
  'Technology', 'Finance', 'Healthcare', 'Education', 'E-commerce',
  'Media & Entertainment', 'Manufacturing', 'Real Estate', 'Consulting',
  'Design & Creative', 'Marketing & Advertising', 'Logistics', 'Other',
];

// ── Completion check ──────────────────────────────────────────────────────────
const getCompletion = (company) => ({
  logo:     !!company?.logo?.url,
  basic:    !!company?.name,
  location: !!(company?.location?.city || company?.location?.country),
  contact:  !!(company?.contact?.email || company?.contact?.phone),
  social:   !!(company?.social?.linkedin || company?.social?.twitter),
});

// ── Field error helper ────────────────────────────────────────────────────────
const FieldError = ({ msg }) =>
  msg ? (
    <p style={{ margin: '0.25rem 0 0', fontSize: '0.72rem', color: 'var(--danger)', fontWeight: 500 }}>
      {msg}
    </p>
  ) : null;

// ── Toast ─────────────────────────────────────────────────────────────────────
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

// ── Input + label helpers ─────────────────────────────────────────────────────
const inputStyle = {
  width: '100%',
  padding: '0.65rem 0.9rem',
  borderRadius: '0.75rem',
  border: '1px solid var(--border)',
  background: 'var(--bg-input)',
  color: 'var(--text-primary)',
  fontSize: '0.875rem',
  outline: 'none',
  transition: 'border-color 0.2s',
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.35rem',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const field = (extra = {}) => ({ display: 'flex', flexDirection: 'column', ...extra });

// ── Main ──────────────────────────────────────────────────────────────────────
const EditCompanyPage = () => {
  const navigate = useNavigate();
  const { data: company, isLoading, isError, error } = useMyCompany();
  const [activeSection, setActiveSection] = useState('logo');
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('success');

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // ── Update mutation ─────────────────────────────────────────────────────────
  const { mutate: updateCompany, isPending: isSaving } = useUpdateCompany({
    onSuccess: () => showToast('Changes saved.', 'success'),
    onError: (e) => showToast(e?.response?.data?.message || 'Failed to save.', 'error'),
  });

  // ── Section drafts (init from company once loaded) ──────────────────────────
  const [basicDraft, setBasicDraft] = useState(null);
  const [locationDraft, setLocationDraft] = useState(null);
  const [contactDraft, setContactDraft] = useState(null);
  const [socialDraft, setSocialDraft] = useState(null);
  const [basicErrors, setBasicErrors] = useState({});
  const [contactErrors, setContactErrors] = useState({});
  const [socialErrors, setSocialErrors] = useState({});

  // Initialise drafts once company data arrives
  if (company && basicDraft === null) {
    setBasicDraft({
      name:        company.name        || '',
      description: company.description || '',
      industry:    company.industry    || '',
      size:        company.size        || '',
      foundedYear: company.foundedYear || '',
      website:     company.website     || '',
    });
    setLocationDraft({
      country: company.location?.country || 'India',
      state:   company.location?.state   || '',
      city:    company.location?.city    || '',
      address: company.location?.address || '',
    });
    setContactDraft({
      email: company.contact?.email || '',
      phone: company.contact?.phone || '',
    });
    setSocialDraft({
      linkedin: company.social?.linkedin || '',
      twitter:  company.social?.twitter  || '',
    });
  }

  // ── Submit handlers ─────────────────────────────────────────────────────────
  const handleSaveBasic = (e) => {
    e.preventDefault();
    const errs = {};
    if (!basicDraft.name?.trim() || basicDraft.name.trim().length < 2)
      errs.name = 'Company name must be at least 2 characters.';
    if (basicDraft.website && !/^https?:\/\/.+/.test(basicDraft.website))
      errs.website = 'Must start with http:// or https://';
    if (basicDraft.foundedYear) {
      const yr = Number(basicDraft.foundedYear);
      if (isNaN(yr) || yr < 1800 || yr > new Date().getFullYear())
        errs.foundedYear = `Enter a year between 1800–${new Date().getFullYear()}.`;
    }
    setBasicErrors(errs);
    if (Object.keys(errs).length) { showToast('Fix the errors below.', 'error'); return; }

    updateCompany({
      name:        basicDraft.name.trim(),
      description: basicDraft.description || undefined,
      industry:    basicDraft.industry    || undefined,
      size:        basicDraft.size        || undefined,
      foundedYear: basicDraft.foundedYear ? Number(basicDraft.foundedYear) : undefined,
      website:     basicDraft.website     || undefined,
    });
  };

  const handleSaveLocation = (e) => {
    e.preventDefault();
    updateCompany({ location: locationDraft });
  };

  const handleSaveContact = (e) => {
    e.preventDefault();
    const errs = {};
    if (contactDraft.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactDraft.email))
      errs.email = 'Enter a valid email address.';
    if (contactDraft.phone && !/^\+?[1-9]\d{7,14}$/.test(contactDraft.phone))
      errs.phone = 'Enter a valid phone (e.g. +919876543210).';
    setContactErrors(errs);
    if (Object.keys(errs).length) { showToast('Fix the errors below.', 'error'); return; }
    updateCompany({ contact: contactDraft });
  };

  const handleSaveSocial = (e) => {
    e.preventDefault();
    const errs = {};
    if (socialDraft.linkedin && !/^https?:\/\/.+/.test(socialDraft.linkedin))
      errs.linkedin = 'Must start with http:// or https://';
    if (socialDraft.twitter && !/^https?:\/\/.+/.test(socialDraft.twitter))
      errs.twitter = 'Must start with http:// or https://';
    setSocialErrors(errs);
    if (Object.keys(errs).length) { showToast('Fix the errors below.', 'error'); return; }
    updateCompany({ social: socialDraft });
  };

  // ── States ──────────────────────────────────────────────────────────────────
  if (isLoading || basicDraft === null) return (
    <MainLayout>
      <div style={{ maxWidth: 900, margin: '3rem auto', padding: '0 1.5rem' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{
            height: 64,
            borderRadius: '0.75rem',
            background: 'var(--bg-elevated)',
            marginBottom: '0.75rem',
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
        ))}
      </div>
    </MainLayout>
  );

  const isNotFound = isError && error?.response?.status === 404;
  if (isNotFound) return (
    <MainLayout>
      <div style={{ maxWidth: 580, margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏢</p>
        <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-primary)', fontWeight: 800 }}>
          No company profile yet
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Create your company profile first before editing.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/company/me')}>
          Create Company Profile
        </button>
      </div>
    </MainLayout>
  );

  if (isError) return (
    <MainLayout>
      <div style={{ maxWidth: 580, margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Something went wrong. Please try again.
      </div>
    </MainLayout>
  );

  const completion = getCompletion(company);

  return (
    <MainLayout>
      <div style={{
        maxWidth: 900,
        margin: '2.5rem auto',
        padding: '0 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Edit Company
            </h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {Object.values(completion).filter(Boolean).length}/{SECTIONS.length} sections completed
            </p>
          </div>
          <button className="btn btn-secondary" onClick={() => navigate('/company/me')}>
            ← Back to Company
          </button>
        </div>

        {/* Sidebar + Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '210px 1fr', gap: '1.25rem', alignItems: 'start' }}>

          {/* Sidebar nav */}
          <nav style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '1rem',
            padding: '0.625rem',
          }}>
            {SECTIONS.map((s) => {
              const done   = completion[s.id];
              const active = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSection(s.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.65rem 0.875rem',
                    borderRadius: '0.625rem',
                    border: 'none',
                    cursor: 'pointer',
                    background: active ? 'var(--accent-soft)' : 'transparent',
                    color: active ? 'var(--accent)' : 'var(--text-secondary)',
                    fontWeight: active ? 700 : 500,
                    fontSize: '0.85rem',
                    transition: 'all 0.15s',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>{s.icon}</span>
                  <span style={{ flex: 1 }}>{s.label}</span>
                  <span style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    flexShrink: 0,
                    background: done ? 'var(--success)' : 'var(--border-strong)',
                    opacity: done ? 1 : 0.5,
                  }} />
                </button>
              );
            })}
          </nav>

          {/* Content panel */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '1rem',
            padding: '1.75rem',
          }}>

            {/* ── Logo ── */}
            {activeSection === 'logo' && (
              <section>
                <h3 style={{ margin: '0 0 0.35rem', fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Company Logo
                </h3>
                <p style={{ margin: '0 0 1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Square image works best. Min 200×200px, max 2MB.
                </p>
                <LogoUploader
                  currentLogo={company.logo?.url}
                  onSuccess={() => showToast('Logo updated!', 'success')}
                  onError={(msg) => showToast(msg, 'error')}
                />
              </section>
            )}

            {/* ── Basic Info ── */}
            {activeSection === 'basic' && (
              <section>
                <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Basic Info
                </h3>
                <form onSubmit={handleSaveBasic} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div style={field()}>
                    <label style={labelStyle}>Company Name *</label>
                    <input
                      style={{ ...inputStyle, borderColor: basicErrors.name ? 'var(--danger)' : undefined }}
                      placeholder="e.g. Acme Corp"
                      value={basicDraft.name}
                      onChange={(e) => { setBasicDraft((p) => ({ ...p, name: e.target.value })); if (basicErrors.name) setBasicErrors((p) => ({ ...p, name: '' })); }}
                      maxLength={200}
                    />
                    <FieldError msg={basicErrors.name} />
                  </div>

                  <div style={field()}>
                    <label style={labelStyle}>Description</label>
                    <textarea
                      style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
                      placeholder="What does your company do?"
                      maxLength={2000}
                      value={basicDraft.description}
                      onChange={(e) => setBasicDraft((p) => ({ ...p, description: e.target.value }))}
                    />
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: '0.2rem' }}>
                      {basicDraft.description.length}/2000
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={field()}>
                      <label style={labelStyle}>Industry</label>
                      <select style={inputStyle} value={basicDraft.industry} onChange={(e) => setBasicDraft((p) => ({ ...p, industry: e.target.value }))}>
                        <option value="">Select industry</option>
                        {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>

                    <div style={field()}>
                      <label style={labelStyle}>Company Size</label>
                      <select style={inputStyle} value={basicDraft.size} onChange={(e) => setBasicDraft((p) => ({ ...p, size: e.target.value }))}>
                        <option value="">Select size</option>
                        {['1-10', '11-50', '51-200', '201-500', '500+'].map((s) => <option key={s} value={s}>{s} employees</option>)}
                      </select>
                    </div>

                    <div style={field()}>
                      <label style={labelStyle}>Founded Year</label>
                      <input
                        type="number"
                        style={{ ...inputStyle, borderColor: basicErrors.foundedYear ? 'var(--danger)' : undefined }}
                        placeholder="e.g. 2015"
                        min={1800}
                        max={new Date().getFullYear()}
                        value={basicDraft.foundedYear}
                        onChange={(e) => { setBasicDraft((p) => ({ ...p, foundedYear: e.target.value })); if (basicErrors.foundedYear) setBasicErrors((p) => ({ ...p, foundedYear: '' })); }}
                      />
                      <FieldError msg={basicErrors.foundedYear} />
                    </div>

                    <div style={field()}>
                      <label style={labelStyle}>Website</label>
                      <input
                        type="url"
                        style={{ ...inputStyle, borderColor: basicErrors.website ? 'var(--danger)' : undefined }}
                        placeholder="https://yourcompany.com"
                        value={basicDraft.website}
                        onChange={(e) => { setBasicDraft((p) => ({ ...p, website: e.target.value })); if (basicErrors.website) setBasicErrors((p) => ({ ...p, website: '' })); }}
                      />
                      <FieldError msg={basicErrors.website} />
                    </div>
                  </div>

                  <div style={{ paddingTop: '0.5rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={isSaving}>
                      {isSaving ? 'Saving…' : 'Save Basic Info'}
                    </button>
                  </div>
                </form>
              </section>
            )}

            {/* ── Location ── */}
            {activeSection === 'location' && (
              <section>
                <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Location
                </h3>
                <form onSubmit={handleSaveLocation} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={field()}>
                      <label style={labelStyle}>Country</label>
                      <input style={inputStyle} placeholder="e.g. India" value={locationDraft.country} onChange={(e) => setLocationDraft((p) => ({ ...p, country: e.target.value }))} />
                    </div>
                    <div style={field()}>
                      <label style={labelStyle}>State / Province</label>
                      <input style={inputStyle} placeholder="e.g. Maharashtra" value={locationDraft.state} onChange={(e) => setLocationDraft((p) => ({ ...p, state: e.target.value }))} />
                    </div>
                    <div style={field()}>
                      <label style={labelStyle}>City</label>
                      <input style={inputStyle} placeholder="e.g. Mumbai" value={locationDraft.city} onChange={(e) => setLocationDraft((p) => ({ ...p, city: e.target.value }))} />
                    </div>
                  </div>
                  <div style={field()}>
                    <label style={labelStyle}>Address</label>
                    <input style={inputStyle} placeholder="Street address (optional)" value={locationDraft.address} onChange={(e) => setLocationDraft((p) => ({ ...p, address: e.target.value }))} />
                  </div>
                  <div>
                    <button type="submit" className="btn btn-primary" disabled={isSaving}>
                      {isSaving ? 'Saving…' : 'Save Location'}
                    </button>
                  </div>
                </form>
              </section>
            )}

            {/* ── Contact ── */}
            {activeSection === 'contact' && (
              <section>
                <h3 style={{ margin: '0 0 0.35rem', fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Contact Details
                </h3>
                <p style={{ margin: '0 0 1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Only visible to verified clients.
                </p>
                <form onSubmit={handleSaveContact} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div style={field()}>
                    <label style={labelStyle}>Business Email</label>
                    <input
                      type="email"
                      style={{ ...inputStyle, borderColor: contactErrors.email ? 'var(--danger)' : undefined }}
                      placeholder="contact@yourcompany.com"
                      value={contactDraft.email}
                      onChange={(e) => { setContactDraft((p) => ({ ...p, email: e.target.value })); if (contactErrors.email) setContactErrors((p) => ({ ...p, email: '' })); }}
                    />
                    <FieldError msg={contactErrors.email} />
                  </div>
                  <div style={field()}>
                    <label style={labelStyle}>Business Phone</label>
                    <input
                      style={{ ...inputStyle, borderColor: contactErrors.phone ? 'var(--danger)' : undefined }}
                      placeholder="+919876543210"
                      value={contactDraft.phone}
                      onChange={(e) => { setContactDraft((p) => ({ ...p, phone: e.target.value })); if (contactErrors.phone) setContactErrors((p) => ({ ...p, phone: '' })); }}
                    />
                    <FieldError msg={contactErrors.phone} />
                  </div>
                  <div>
                    <button type="submit" className="btn btn-primary" disabled={isSaving}>
                      {isSaving ? 'Saving…' : 'Save Contact'}
                    </button>
                  </div>
                </form>
              </section>
            )}

            {/* ── Social ── */}
            {activeSection === 'social' && (
              <section>
                <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Social Links
                </h3>
                <form onSubmit={handleSaveSocial} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div style={field()}>
                    <label style={labelStyle}>LinkedIn</label>
                    <input
                      type="url"
                      style={{ ...inputStyle, borderColor: socialErrors.linkedin ? 'var(--danger)' : undefined }}
                      placeholder="https://linkedin.com/company/yourcompany"
                      value={socialDraft.linkedin}
                      onChange={(e) => { setSocialDraft((p) => ({ ...p, linkedin: e.target.value })); if (socialErrors.linkedin) setSocialErrors((p) => ({ ...p, linkedin: '' })); }}
                    />
                    <FieldError msg={socialErrors.linkedin} />
                  </div>
                  <div style={field()}>
                    <label style={labelStyle}>Twitter / X</label>
                    <input
                      type="url"
                      style={{ ...inputStyle, borderColor: socialErrors.twitter ? 'var(--danger)' : undefined }}
                      placeholder="https://twitter.com/yourcompany"
                      value={socialDraft.twitter}
                      onChange={(e) => { setSocialDraft((p) => ({ ...p, twitter: e.target.value })); if (socialErrors.twitter) setSocialErrors((p) => ({ ...p, twitter: '' })); }}
                    />
                    <FieldError msg={socialErrors.twitter} />
                  </div>
                  <div>
                    <button type="submit" className="btn btn-primary" disabled={isSaving}>
                      {isSaving ? 'Saving…' : 'Save Social Links'}
                    </button>
                  </div>
                </form>
              </section>
            )}

          </div>
        </div>
      </div>

      {toastMsg && <Toast msg={toastMsg} type={toastType} onDismiss={() => setToastMsg(null)} />}
    </MainLayout>
  );
};

export default EditCompanyPage;