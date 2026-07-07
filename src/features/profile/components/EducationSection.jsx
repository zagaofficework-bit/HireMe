// profile/components/EducationSection.jsx
import { useState } from 'react';
import { useUpdateEducation } from '../../../hooks/useEditProfile';

const emptyEntry = () => ({ degree: '', institution: '', year: '' });

const EducationSection = ({ education = [], editable = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(education);
  const { mutate: saveEducation, isPending, error } = useUpdateEducation({
    onSuccess: () => setIsEditing(false),
  });

  const startEdit = () => {
    setDraft(education.length ? education : [emptyEntry()]);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraft(education);
    setIsEditing(false);
  };

  const updateField = (index, field, value) => {
    setDraft((prev) => prev.map((entry, i) => (i === index ? { ...entry, [field]: value } : entry)));
  };

  const addEntry = () => setDraft((prev) => [...prev, emptyEntry()]);
  const removeEntry = (index) => setDraft((prev) => prev.filter((_, i) => i !== index));

  const handleSave = () => {
    const cleaned = draft
      .filter((e) => e.degree.trim() && e.institution.trim())
      .map((e) => ({ ...e, year: e.year ? Number(e.year) : undefined }));
    saveEducation(cleaned);
  };

  return (
    <section className="profile-section">
      <div className="profile-section__header">
        <h3>Education</h3>
        {editable && !isEditing && (
          <button className="btn btn-link" onClick={startEdit}>Edit</button>
        )}
      </div>

      {error && <p className="form-error">{error.response?.data?.message || 'Failed to save education.'}</p>}

      {!isEditing && (
        <div className="education-list">
          {education.length === 0 && <p className="empty-state">No education added yet.</p>}
          {education.map((entry, i) => (
            <div key={i} className="education-item">
              <strong>{entry.degree}</strong>
              <p className="education-item__institution">
                {entry.institution}{entry.year ? ` · ${entry.year}` : ''}
              </p>
            </div>
          ))}
        </div>
      )}

      {isEditing && (
        <div className="education-editor">
          {draft.map((entry, i) => (
            <div key={i} className="form-row education-editor__row">
              <input
                className="input-field"
                placeholder="Degree (e.g. B.Tech Computer Science)"
                value={entry.degree}
                onChange={(e) => updateField(i, 'degree', e.target.value)}
              />
              <input
                className="input-field"
                placeholder="Institution"
                value={entry.institution}
                onChange={(e) => updateField(i, 'institution', e.target.value)}
              />
              <input
                type="number"
                className="input-field input-field--year"
                placeholder="Year"
                min={1970}
                max={new Date().getFullYear()}
                value={entry.year}
                onChange={(e) => updateField(i, 'year', e.target.value)}
              />
              <button type="button" className="btn btn-icon btn-danger" onClick={() => removeEntry(i)} aria-label="Remove">
                ✕
              </button>
            </div>
          ))}

          {draft.length < 10 && (
            <button type="button" className="btn btn-outline" onClick={addEntry}>
              + Add Education
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

export default EducationSection;