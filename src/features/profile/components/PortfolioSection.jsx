// profile/components/PortfolioSection.jsx
//
// "Projects" in the UI — maps to the backend's `portfolio` field/route,
// so we keep that name internally to stay consistent with profile.model.js,
// profile.api.js, and useEditProfile.js (useUpdatePortfolio).
//
// Same read-only vs. editable pattern as CertificationsSection.

import { useEffect, useState } from 'react';
import { useUpdatePortfolio } from '../../../hooks/useEditProfile';
import { useToast, ToastContainer } from './Toast';

const emptyProject = { title: '', description: '', url: '' };

const PortfolioSection = ({ portfolio = [], editable = false }) => {
  const { toasts, show: showToast, dismiss } = useToast();
  const [items, setItems] = useState(portfolio);
  const [draft, setDraft] = useState(emptyProject);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setItems(portfolio || []);
  }, [portfolio]);

  const { mutate: savePortfolio, isPending: isSaving } = useUpdatePortfolio({
    onSuccess: () => showToast('Projects saved.', 'success'),
    onError: (e) => showToast(e?.response?.data?.message || 'Failed to save projects.', 'error'),
  });

  const validateDraft = () => {
    const errs = {};
    if (!draft.title.trim()) errs.title = 'Title is required';
    if (draft.description && draft.description.length > 500) errs.description = 'Max 500 characters';
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
        title: draft.title.trim(),
        description: draft.description.trim() || undefined,
        url: draft.url.trim() || undefined,
      },
    ]);
    setDraft(emptyProject);
    setErrors({});
  };

  const handleRemove = (idx) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    savePortfolio(items);
  };

  if (!editable) {
    if (!portfolio || portfolio.length === 0) return null;
    return (
      <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5">
        <h3 className="text-base font-bold text-[var(--text-primary)] mb-3">Projects</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {portfolio.map((p, i) => (
            <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3.5">
              {p.image?.url && (
                <img src={p.image.url} alt={p.title} className="w-full h-32 object-cover rounded-lg mb-2.5" />
              )}
              <p className="font-semibold text-[var(--text-primary)] text-sm">{p.title}</p>
              {p.description && (
                <p className="text-[var(--text-muted)] text-xs mt-1 line-clamp-3">{p.description}</p>
              )}
              {p.url && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--accent)] text-xs font-semibold hover:underline mt-2 inline-block"
                >
                  View project →
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="profile-section">
      <h3>Projects</h3>

      {items.length > 0 && (
        <ul className="flex flex-col gap-2 mb-4">
          {items.map((p, i) => (
            <li
              key={i}
              className="flex items-start justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3.5 py-2.5"
            >
              <div className="text-sm">
                <span className="font-semibold text-[var(--text-primary)]">{p.title}</span>
                {p.description && (
                  <p className="text-[var(--text-muted)] text-xs mt-1">{p.description}</p>
                )}
                {p.url && <p className="text-[var(--accent)] text-xs mt-1">{p.url}</p>}
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
        <div className="form-grid__full">
          <input
            className="input-field"
            placeholder="Project title *"
            value={draft.title}
            onChange={(e) => {
              setDraft((p) => ({ ...p, title: e.target.value }));
              if (errors.title) setErrors((p) => ({ ...p, title: '' }));
            }}
          />
          {errors.title && <p className="form-error" style={{ marginTop: '0.25rem' }}>{errors.title}</p>}
        </div>

        <div className="form-grid__full">
          <textarea
            className="input-field"
            placeholder="Short description (max 500 characters)"
            maxLength={500}
            value={draft.description}
            onChange={(e) => {
              setDraft((p) => ({ ...p, description: e.target.value }));
              if (errors.description) setErrors((p) => ({ ...p, description: '' }));
            }}
          />
          {errors.description && <p className="form-error" style={{ marginTop: '0.25rem' }}>{errors.description}</p>}
        </div>

        <div className="form-grid__full">
          <input
            className="input-field"
            placeholder="Project URL (optional)"
            value={draft.url}
            onChange={(e) => {
              setDraft((p) => ({ ...p, url: e.target.value }));
              if (errors.url) setErrors((p) => ({ ...p, url: '' }));
            }}
          />
          {errors.url && <p className="form-error" style={{ marginTop: '0.25rem' }}>{errors.url}</p>}
        </div>

        <button type="button" className="btn btn-outline" onClick={handleAdd}>
          + Add Project
        </button>
      </div>

      <div className="profile-section__actions" style={{ marginTop: '1rem' }}>
        <button type="button" className="btn btn-primary" disabled={isSaving} onClick={handleSave}>
          {isSaving ? 'Saving...' : 'Save Projects'}
        </button>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </section>
  );
};

export default PortfolioSection;