// profile/components/ExperienceSection.jsx
import { useState } from 'react';
import { useUpdateExperience } from '../../../hooks/useEditProfile';

const emptyEntry = () => ({
  title: '',
  company: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  description: '',
});

const formatRange = (entry) => {
  const start = entry.startDate ? new Date(entry.startDate).getFullYear() : '';
  const end = entry.isCurrent ? 'Present' : entry.endDate ? new Date(entry.endDate).getFullYear() : '';
  return [start, end].filter(Boolean).join(' – ');
};

const ExperienceSection = ({ experience = [], editable = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(experience);
  const { mutate: saveExperience, isPending, error } = useUpdateExperience({
    onSuccess: () => setIsEditing(false),
  });

  const startEdit = () => {
    setDraft(experience.length ? experience : [emptyEntry()]);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraft(experience);
    setIsEditing(false);
  };

  const updateField = (index, field, value) => {
    setDraft((prev) => prev.map((entry, i) => (i === index ? { ...entry, [field]: value } : entry)));
  };

  const addEntry = () => setDraft((prev) => [...prev, emptyEntry()]);
  const removeEntry = (index) => setDraft((prev) => prev.filter((_, i) => i !== index));

  const handleSave = () => {
    // backend requires title, company, startDate per entry — trim out blank rows
    const cleaned = draft.filter((e) => e.title.trim() && e.company.trim() && e.startDate);
    saveExperience(cleaned);
  };

  return (
    <section className="profile-section">
      <div className="profile-section__header">
        <h3>Experience</h3>
        {editable && !isEditing && (
          <button className="btn btn-link" onClick={startEdit}>Edit</button>
        )}
      </div>

      {error && <p className="form-error">{error.response?.data?.message || 'Failed to save experience.'}</p>}

      {!isEditing && (
        <div className="experience-list">
          {experience.length === 0 && <p className="empty-state">No experience added yet.</p>}
          {experience.map((entry, i) => (
            <div key={i} className="experience-item">
              <div className="experience-item__top">
                <strong>{entry.title}</strong>
                <span className="experience-item__dates">{formatRange(entry)}</span>
              </div>
              <p className="experience-item__company">{entry.company}</p>
              {entry.description && <p className="experience-item__desc">{entry.description}</p>}
            </div>
          ))}
        </div>
      )}

      {isEditing && (
        <div className="experience-editor">
          {draft.map((entry, i) => (
            <div key={i} className="experience-editor__card">
              <div className="form-row">
                <input
                  className="input-field"
                  placeholder="Job title"
                  value={entry.title}
                  onChange={(e) => updateField(i, 'title', e.target.value)}
                />
                <input
                  className="input-field"
                  placeholder="Company"
                  value={entry.company}
                  onChange={(e) => updateField(i, 'company', e.target.value)}
                />
              </div>
              <div className="form-row">
                <input
                  type="date"
                  className="input-field"
                  value={entry.startDate?.slice(0, 10) || ''}
                  onChange={(e) => updateField(i, 'startDate', e.target.value)}
                />
                <input
                  type="date"
                  className="input-field"
                  value={entry.endDate?.slice(0, 10) || ''}
                  disabled={entry.isCurrent}
                  onChange={(e) => updateField(i, 'endDate', e.target.value)}
                />
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={entry.isCurrent}
                    onChange={(e) => updateField(i, 'isCurrent', e.target.checked)}
                  />
                  Currently working here
                </label>
              </div>
              <textarea
                className="input-field"
                placeholder="Description (optional)"
                maxLength={500}
                value={entry.description}
                onChange={(e) => updateField(i, 'description', e.target.value)}
              />
              <button type="button" className="btn btn-text btn-danger" onClick={() => removeEntry(i)}>
                Remove this entry
              </button>
            </div>
          ))}

          {draft.length < 20 && (
            <button type="button" className="btn btn-outline" onClick={addEntry}>
              + Add Experience
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

export default ExperienceSection;