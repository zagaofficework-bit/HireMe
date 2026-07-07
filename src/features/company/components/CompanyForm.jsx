// src/features/company/components/CompanyForm.jsx
// 4-step wizard: Basic Info → Location → Contact → Social
// Used by both MyCompanyPage (create) and EditCompanyPage (update)
import { useState } from 'react';

// ── Validation ────────────────────────────────────────────────────────────────
const validateStep = (step, draft) => {
  const errors = {};
  if (step === 0) {
    if (!draft.name?.trim() || draft.name.trim().length < 2)
      errors.name = 'Company name must be at least 2 characters.';
    if (draft.website && !/^https?:\/\/.+/.test(draft.website))
      errors.website = 'Website must start with http:// or https://';
    if (draft.foundedYear) {
      const yr = Number(draft.foundedYear);
      if (isNaN(yr) || yr < 1800 || yr > new Date().getFullYear())
        errors.foundedYear = `Enter a year between 1800 and ${new Date().getFullYear()}.`;
    }
  }
  if (step === 2) {
    if (draft.contact?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.contact.email))
      errors.contactEmail = 'Enter a valid email address.';
    if (draft.contact?.phone && !/^\+?[1-9]\d{7,14}$/.test(draft.contact.phone))
      errors.contactPhone = 'Enter a valid phone number (e.g. +919876543210).';
  }
  if (step === 3) {
    if (draft.social?.linkedin && !/^https?:\/\/.+/.test(draft.social.linkedin))
      errors.linkedin = 'LinkedIn URL must start with http:// or https://';
    if (draft.social?.twitter && !/^https?:\/\/.+/.test(draft.social.twitter))
      errors.twitter = 'Twitter URL must start with http:// or https://';
  }
  return { valid: Object.keys(errors).length === 0, errors };
};

// ── Field error helper ────────────────────────────────────────────────────────
const FieldError = ({ msg }) =>
  msg ? (
    <p style={{ margin: '0.25rem 0 0', fontSize: '0.72rem', color: 'var(--danger)', fontWeight: 500 }}>
      {msg}
    </p>
  ) : null;

// ── Stepper header ────────────────────────────────────────────────────────────
const STEPS = ['Basic Info', 'Location', 'Contact', 'Social Links'];

const StepHeader = ({ current }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: '2rem' }}>
    {STEPS.map((label, i) => {
      const done    = i < current;
      const active  = i === current;
      return (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
            <div style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.78rem',
              background: done
                ? 'var(--success)'
                : active
                  ? 'var(--accent)'
                  : 'var(--bg-elevated)',
              color: done || active ? (done ? '#fff' : 'var(--accent-text)') : 'var(--text-muted)',
              border: done || active ? 'none' : '1.5px solid var(--border-strong)',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}>
              {done ? '✓' : i + 1}
            </div>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: active ? 700 : 500,
              color: active ? 'var(--accent)' : done ? 'var(--success)' : 'var(--text-muted)',
              whiteSpace: 'nowrap',
            }}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{
              flex: 1,
              height: 2,
              marginBottom: 18,
              background: done ? 'var(--success)' : 'var(--border)',
              transition: 'background 0.3s',
            }} />
          )}
        </div>
      );
    })}
  </div>
);

// ── Industry options ──────────────────────────────────────────────────────────
const INDUSTRIES = [
  'Technology', 'Finance', 'Healthcare', 'Education', 'E-commerce',
  'Media & Entertainment', 'Manufacturing', 'Real Estate', 'Consulting',
  'Design & Creative', 'Marketing & Advertising', 'Logistics', 'Other',
];

// ── Main component ────────────────────────────────────────────────────────────
const CompanyForm = ({
  initialData = {},
  onSubmit,       // (payload, step) → called on final submit
  isSubmitting = false,
  submitLabel = 'Create Company',
  mode = 'create', // 'create' | 'edit'
}) => {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});

  const [draft, setDraft] = useState({
    name:        initialData.name        || '',
    description: initialData.description || '',
    industry:    initialData.industry    || '',
    size:        initialData.size        || '',
    foundedYear: initialData.foundedYear || '',
    website:     initialData.website     || '',
    location: {
      country: initialData.location?.country || 'India',
      state:   initialData.location?.state   || '',
      city:    initialData.location?.city    || '',
      address: initialData.location?.address || '',
    },
    contact: {
      email: initialData.contact?.email || '',
      phone: initialData.contact?.phone || '',
    },
    social: {
      linkedin: initialData.social?.linkedin || '',
      twitter:  initialData.social?.twitter  || '',
    },
  });

  const set = (field, value) => {
    setDraft((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
  };

  const setNested = (parent, field, value) => {
    setDraft((p) => ({ ...p, [parent]: { ...p[parent], [field]: value } }));
    const key = `${parent}${field.charAt(0).toUpperCase() + field.slice(1)}`;
    if (errors[key]) setErrors((p) => ({ ...p, [key]: '' }));
  };

  const handleNext = () => {
    const { valid, errors: errs } = validateStep(step, draft);
    if (!valid) { setErrors(errs); return; }
    setErrors({});
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { valid, errors: errs } = validateStep(step, draft);
    if (!valid) { setErrors(errs); return; }
    setErrors({});

    // Build clean payload
    const payload = {
      name:        draft.name.trim(),
      description: draft.description || undefined,
      industry:    draft.industry    || undefined,
      size:        draft.size        || undefined,
      foundedYear: draft.foundedYear ? Number(draft.foundedYear) : undefined,
      website:     draft.website     || undefined,
      location: {
        country: draft.location.country || undefined,
        state:   draft.location.state   || undefined,
        city:    draft.location.city    || undefined,
        address: draft.location.address || undefined,
      },
      contact: {
        email: draft.contact.email || undefined,
        phone: draft.contact.phone || undefined,
      },
      social: {
        linkedin: draft.social.linkedin || undefined,
        twitter:  draft.social.twitter  || undefined,
      },
    };

    onSubmit(payload);
  };

  // ── Input style shorthand ─────────────────────────────────────────────────
  const inputStyle = {
    width: '100%',
    padding: '0.65rem 0.9rem',
    borderRadius: '0.75rem',
    border: '1px solid var(--border)',
    background: 'var(--bg-input)',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.4rem',
    fontSize: '0.78rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const fieldStyle = { display: 'flex', flexDirection: 'column', gap: 0 };

  return (
    <div>
      <StepHeader current={step} />

      <form onSubmit={handleSubmit} noValidate>

        {/* ── Step 0: Basic Info ────────────────────────────────────────── */}
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Company Name *</label>
              <input
                style={{ ...inputStyle, borderColor: errors.name ? 'var(--danger)' : undefined }}
                placeholder="e.g. Acme Corp"
                value={draft.name}
                onChange={(e) => set('name', e.target.value)}
                maxLength={200}
              />
              <FieldError msg={errors.name} />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Description</label>
              <textarea
                style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
                placeholder="What does your company do?"
                maxLength={2000}
                value={draft.description}
                onChange={(e) => set('description', e.target.value)}
              />
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.2rem', textAlign: 'right' }}>
                {draft.description.length}/2000
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Industry</label>
                <select
                  style={inputStyle}
                  value={draft.industry}
                  onChange={(e) => set('industry', e.target.value)}
                >
                  <option value="">Select industry</option>
                  {INDUSTRIES.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Company Size</label>
                <select
                  style={inputStyle}
                  value={draft.size}
                  onChange={(e) => set('size', e.target.value)}
                >
                  <option value="">Select size</option>
                  {['1-10', '11-50', '51-200', '201-500', '500+'].map((s) => (
                    <option key={s} value={s}>{s} employees</option>
                  ))}
                </select>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Founded Year</label>
                <input
                  type="number"
                  style={{ ...inputStyle, borderColor: errors.foundedYear ? 'var(--danger)' : undefined }}
                  placeholder={`e.g. 2015`}
                  min={1800}
                  max={new Date().getFullYear()}
                  value={draft.foundedYear}
                  onChange={(e) => set('foundedYear', e.target.value)}
                />
                <FieldError msg={errors.foundedYear} />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Website</label>
                <input
                  type="url"
                  style={{ ...inputStyle, borderColor: errors.website ? 'var(--danger)' : undefined }}
                  placeholder="https://yourcompany.com"
                  value={draft.website}
                  onChange={(e) => set('website', e.target.value)}
                />
                <FieldError msg={errors.website} />
              </div>
            </div>
          </div>
        )}

        {/* ── Step 1: Location ──────────────────────────────────────────── */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Country</label>
                <input
                  style={inputStyle}
                  placeholder="e.g. India"
                  value={draft.location.country}
                  onChange={(e) => setNested('location', 'country', e.target.value)}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>State / Province</label>
                <input
                  style={inputStyle}
                  placeholder="e.g. Maharashtra"
                  value={draft.location.state}
                  onChange={(e) => setNested('location', 'state', e.target.value)}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>City</label>
                <input
                  style={inputStyle}
                  placeholder="e.g. Mumbai"
                  value={draft.location.city}
                  onChange={(e) => setNested('location', 'city', e.target.value)}
                />
              </div>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Address</label>
              <input
                style={inputStyle}
                placeholder="Street address (optional)"
                value={draft.location.address}
                onChange={(e) => setNested('location', 'address', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* ── Step 2: Contact ───────────────────────────────────────────── */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              background: 'var(--info-soft)',
              border: '1px solid rgba(93,163,255,0.2)',
              fontSize: '0.8rem',
              color: 'var(--info)',
            }}>
              ℹ️ Contact details are only visible to verified clients.
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Business Email</label>
              <input
                type="email"
                style={{ ...inputStyle, borderColor: errors.contactEmail ? 'var(--danger)' : undefined }}
                placeholder="contact@yourcompany.com"
                value={draft.contact.email}
                onChange={(e) => setNested('contact', 'email', e.target.value)}
              />
              <FieldError msg={errors.contactEmail} />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Business Phone</label>
              <input
                style={{ ...inputStyle, borderColor: errors.contactPhone ? 'var(--danger)' : undefined }}
                placeholder="+919876543210"
                value={draft.contact.phone}
                onChange={(e) => setNested('contact', 'phone', e.target.value)}
              />
              <FieldError msg={errors.contactPhone} />
            </div>
          </div>
        )}

        {/* ── Step 3: Social Links ──────────────────────────────────────── */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>LinkedIn</label>
              <input
                type="url"
                style={{ ...inputStyle, borderColor: errors.linkedin ? 'var(--danger)' : undefined }}
                placeholder="https://linkedin.com/company/yourcompany"
                value={draft.social.linkedin}
                onChange={(e) => setNested('social', 'linkedin', e.target.value)}
              />
              <FieldError msg={errors.linkedin} />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Twitter / X</label>
              <input
                type="url"
                style={{ ...inputStyle, borderColor: errors.twitter ? 'var(--danger)' : undefined }}
                placeholder="https://twitter.com/yourcompany"
                value={draft.social.twitter}
                onChange={(e) => setNested('social', 'twitter', e.target.value)}
              />
              <FieldError msg={errors.twitter} />
            </div>
          </div>
        )}

        {/* ── Nav buttons ───────────────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '2rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border)',
        }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleBack}
            style={{ visibility: step === 0 ? 'hidden' : 'visible' }}
          >
            ← Back
          </button>

          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Step {step + 1} of {STEPS.length}
          </span>

          {step < STEPS.length - 1 ? (
            <button type="button" className="btn btn-primary" onClick={handleNext}>
              Next →
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving…' : submitLabel}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CompanyForm;