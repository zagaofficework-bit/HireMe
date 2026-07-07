// profile/components/CertificationsSection.jsx
//
// Mirrors the array-section pattern used elsewhere (Skills/Education):
// shows a read-only list when `editable` is false (MyProfilePage /
// PublicProfilePage), and a local-draft CRUD form + Save button when
// `editable` is true (EditProfilePage). Built with Tailwind, using the
// project's existing CSS-var design tokens via arbitrary-value classes
// so it matches the rest of the theme.

import { useEffect, useState } from 'react';
import { useUpdateCertifications } from '../../../hooks/useEditProfile';
import { useToast, ToastContainer } from './Toast';

const emptyCert = { name: '', issuer: '', year: '', url: '' };

const CertificationsSection = ({ certifications = [], editable = false }) => {
  const { toasts, show: showToast, dismiss } = useToast();
  const [items, setItems] = useState(certifications);
  const [draft, setDraft] = useState(emptyCert);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setItems(certifications || []);
  }, [certifications]);

  const { mutate: saveCertifications, isPending: isSaving } = useUpdateCertifications({
    onSuccess: () => showToast('Certifications saved.', 'success'),
    onError: (e) => showToast(e?.response?.data?.message || 'Failed to save certifications.', 'error'),
  });

  const validateDraft = () => {
    const errs = {};
    if (!draft.name.trim()) errs.name = 'Name is required';
    if (!draft.issuer.trim()) errs.issuer = 'Issuer is required';
    if (draft.year && (Number(draft.year) < 1970 || Number(draft.year) > new Date().getFullYear())) {
      errs.year = 'Enter a valid year';
    }
    if (draft.url && !/^https?:\/\/.+/.test(draft.url)) errs.url = 'Enter a valid URL';
    return errs;
  };

  const handleAdd = () => {
    const errs = validateDraft();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setItems((prev) => [
      ...prev,
      {
        name: draft.name.trim(),
        issuer: draft.issuer.trim(),
        year: draft.year ? Number(draft.year) : undefined,
        url: draft.url.trim() || undefined,
      },
    ]);
    setDraft(emptyCert);
    setErrors({});
  };

  const handleRemove = (idx) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    saveCertifications(items);
  };

  if (!editable) {
    if (!certifications || certifications.length === 0) return null;
    return (
      <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5">
        <h3 className="text-base font-bold text-[var(--text-primary)] mb-3">Certifications</h3>
        <ul className="flex flex-col gap-2.5">
          {certifications.map((c, i) => (
            <li key={i} className="flex items-baseline justify-between gap-3 text-sm">
              <div>
                <span className="font-semibold text-[var(--text-primary)]">{c.name}</span>
                <span className="text-[var(--text-muted)]"> — {c.issuer}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {c.year && <span className="text-[var(--text-muted)] text-xs">{c.year}</span>}
                {c.url && (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--accent)] text-xs font-semibold hover:underline"
                  >
                    View
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className="profile-section">
      <h3>Certifications</h3>

      {items.length > 0 && (
        <ul className="flex flex-col gap-2 mb-4">
          {items.map((c, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3.5 py-2.5"
            >
              <div className="text-sm">
                <span className="font-semibold text-[var(--text-primary)]">{c.name}</span>
                <span className="text-[var(--text-muted)]"> — {c.issuer}</span>
                {c.year && <span className="text-[var(--text-muted)]"> ({c.year})</span>}
              </div>
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="text-[var(--danger)] text-xs font-semibold flex-shrink-0 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="form-grid">
        <div>
          <input
            className="input-field"
            placeholder="Certification name *"
            value={draft.name}
            onChange={(e) => {
              setDraft((p) => ({ ...p, name: e.target.value }));
              if (errors.name) setErrors((p) => ({ ...p, name: '' }));
            }}
          />
          {errors.name && <p className="form-error" style={{ marginTop: '0.25rem' }}>{errors.name}</p>}
        </div>

        <div>
          <input
            className="input-field"
            placeholder="Issuer (e.g. AWS, Google) *"
            value={draft.issuer}
            onChange={(e) => {
              setDraft((p) => ({ ...p, issuer: e.target.value }));
              if (errors.issuer) setErrors((p) => ({ ...p, issuer: '' }));
            }}
          />
          {errors.issuer && <p className="form-error" style={{ marginTop: '0.25rem' }}>{errors.issuer}</p>}
        </div>

        <div>
          <input
            type="number"
            className="input-field"
            placeholder="Year"
            value={draft.year}
            onChange={(e) => {
              setDraft((p) => ({ ...p, year: e.target.value }));
              if (errors.year) setErrors((p) => ({ ...p, year: '' }));
            }}
          />
          {errors.year && <p className="form-error" style={{ marginTop: '0.25rem' }}>{errors.year}</p>}
        </div>

        <div>
          <input
            className="input-field"
            placeholder="Credential URL (optional)"
            value={draft.url}
            onChange={(e) => {
              setDraft((p) => ({ ...p, url: e.target.value }));
              if (errors.url) setErrors((p) => ({ ...p, url: '' }));
            }}
          />
          {errors.url && <p className="form-error" style={{ marginTop: '0.25rem' }}>{errors.url}</p>}
        </div>

        <button type="button" className="btn btn-outline" onClick={handleAdd}>
          + Add Certification
        </button>
      </div>

      <div className="profile-section__actions" style={{ marginTop: '1rem' }}>
        <button type="button" className="btn btn-primary" disabled={isSaving} onClick={handleSave}>
          {isSaving ? 'Saving...' : 'Save Certifications'}
        </button>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </section>
  );
};

export default CertificationsSection;