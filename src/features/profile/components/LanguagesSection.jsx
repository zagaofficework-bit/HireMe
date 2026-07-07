// profile/components/LanguagesSection.jsx
import { useState } from 'react';
import { useUpdateLanguages } from '../../../hooks/useEditProfile';

const PROFICIENCIES = ['basic', 'conversational', 'fluent', 'native'];
const emptyEntry = () => ({ name: '', proficiency: 'fluent' });

const LanguagesSection = ({ languages = [], editable = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(languages);
  const { mutate: saveLanguages, isPending, error } = useUpdateLanguages({
    onSuccess: () => setIsEditing(false),
  });

  const startEdit = () => {
    setDraft(languages.length ? languages : [emptyEntry()]);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraft(languages);
    setIsEditing(false);
  };

  const updateField = (index, field, value) => {
    setDraft((prev) => prev.map((entry, i) => (i === index ? { ...entry, [field]: value } : entry)));
  };

  const addEntry = () => setDraft((prev) => [...prev, emptyEntry()]);
  const removeEntry = (index) => setDraft((prev) => prev.filter((_, i) => i !== index));

  const handleSave = () => {
    const cleaned = draft.filter((l) => l.name.trim().length > 0);
    saveLanguages(cleaned);
  };

  return (
    <section className="profile-section">
      <div className="profile-section__header">
        <h3>Languages</h3>
        {editable && !isEditing && (
          <button className="btn btn-link" onClick={startEdit}>Edit</button>
        )}
      </div>

      {error && <p className="form-error">{error.response?.data?.message || 'Failed to save languages.'}</p>}

      {!isEditing && (
        <div className="languages-list">
          {languages.length === 0 && <p className="empty-state">No languages added yet.</p>}
          {languages.map((lang, i) => (
            <span key={`${lang.name}-${i}`} className="language-chip">
              {lang.name} <span className="language-chip__level">({lang.proficiency})</span>
            </span>
          ))}
        </div>
      )}

      {isEditing && (
        <div className="languages-editor">
          {draft.map((lang, i) => (
            <div key={i} className="languages-editor__row">
              <input
                className="input-field"
                placeholder="e.g. English"
                value={lang.name}
                onChange={(e) => updateField(i, 'name', e.target.value)}
              />
              <select
                className="input-field"
                value={lang.proficiency}
                onChange={(e) => updateField(i, 'proficiency', e.target.value)}
              >
                {PROFICIENCIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <button type="button" className="btn btn-icon btn-danger" onClick={() => removeEntry(i)} aria-label="Remove">
                ✕
              </button>
            </div>
          ))}

          {draft.length < 10 && (
            <button type="button" className="btn btn-outline" onClick={addEntry}>
              + Add Language
            </button>
          )}

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

export default LanguagesSection;