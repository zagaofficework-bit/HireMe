// profile/components/SocialSection.jsx
import { useState } from 'react';
import { useUpdateSocial } from '../../../hooks/useEditProfile';

const FIELDS = [
  { key: 'linkedin', label: 'LinkedIn', icon: '🔗' },
  { key: 'github', label: 'GitHub', icon: '💻' },
  { key: 'website', label: 'Website', icon: '🌐' },
];

const SocialSection = ({ social = {}, editable = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(social);
  const { mutate: saveSocial, isPending, error } = useUpdateSocial({
    onSuccess: () => setIsEditing(false),
  });

  const startEdit = () => {
    setDraft(social);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraft(social);
    setIsEditing(false);
  };

  const handleSave = () => saveSocial(draft);

  const hasAnyLink = FIELDS.some((f) => social?.[f.key]);

  return (
    <section className="profile-section">
      <div className="profile-section__header">
        <h3>Social Links</h3>
        {editable && !isEditing && (
          <button className="btn btn-link" onClick={startEdit}>Edit</button>
        )}
      </div>

      {error && <p className="form-error">{error.response?.data?.message || 'Failed to save social links.'}</p>}

      {!isEditing && (
        <div className="social-links">
          {!hasAnyLink && <p className="empty-state">No social links added yet.</p>}
          {FIELDS.map(({ key, label, icon }) =>
            social?.[key] ? (
              <a key={key} href={social[key]} target="_blank" rel="noopener noreferrer" className="social-link">
                {icon} {label}
              </a>
            ) : null
          )}
        </div>
      )}

      {isEditing && (
        <div className="social-editor">
          {FIELDS.map(({ key, label }) => (
            <div key={key} className="form-row">
              <label>{label}</label>
              <input
                type="url"
                className="input-field"
                placeholder={`https://...`}
                value={draft[key] || ''}
                onChange={(e) => setDraft((prev) => ({ ...prev, [key]: e.target.value }))}
              />
            </div>
          ))}

          <div className="profile-section__actions">
            <button className="btn btn-primary" onClick={handleSave} disabled={isPending}>
              {isPending ? 'Saving...' : 'Save'}
            </button>
            <button className="btn btn-text" onClick={cancelEdit} disabled={isPending}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default SocialSection;