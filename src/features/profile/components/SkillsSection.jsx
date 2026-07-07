// profile/components/SkillsSection.jsx
//
// Pattern used by all Section components:
//  - `editable` prop turns on the "Edit" toggle for the profile owner
//  - local draft state while editing, only PATCHed on Save
//  - on Cancel, draft resets back to the saved `skills` prop
//
// Skill `name` is now chosen from a dropdown built from Category.skills
// (grouped by category via <optgroup>) instead of free text.
import { useState, useMemo } from 'react';
import { useUpdateSkills } from '../../../hooks/useEditProfile';
// 👇 adjust this path if SkillsSection doesn't sit at the same depth as CategoryPage.jsx
import { useCategories } from '../../../hooks/useCategories';

const LEVELS = ['beginner', 'intermediate', 'expert'];

const SkillsSection = ({ skills = [], editable = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(skills);
  const { mutate: saveSkills, isPending, error } = useUpdateSkills({
    onSuccess: () => setIsEditing(false),
  });

  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();

  // Flat set of every skill name that's already been picked, so the
  // dropdown doesn't offer the same skill twice across rows.
  const selectedNames = useMemo(
    () => new Set(draft.map((s) => s.name).filter(Boolean)),
    [draft]
  );

  const startEdit = () => {
    setDraft(skills);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraft(skills);
    setIsEditing(false);
  };

  const addSkill = () => {
    setDraft((prev) => [...prev, { name: '', level: 'intermediate' }]);
  };

  const updateSkillField = (index, field, value) => {
    setDraft((prev) =>
      prev.map((skill, i) => (i === index ? { ...skill, [field]: value } : skill))
    );
  };

  const removeSkill = (index) => {
    setDraft((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const cleaned = draft.filter((s) => s.name.trim().length > 0);
    saveSkills(cleaned);
  };

  return (
    <section className="profile-section">
      <div className="profile-section__header">
        <h3>Skills</h3>
        {editable && !isEditing && (
          <button className="btn btn-link" onClick={startEdit}>Edit</button>
        )}
      </div>

      {error && <p className="form-error">{error.response?.data?.message || 'Failed to save skills.'}</p>}

      {!isEditing && (
        <div className="skills-list">
          {skills.length === 0 && <p className="empty-state">No skills added yet.</p>}
          {skills.map((skill, i) => (
            <span key={`${skill.name}-${i}`} className={`skill-chip skill-chip--${skill.level}`}>
              {skill.name}
              <span className="skill-chip__level">{skill.level}</span>
            </span>
          ))}
        </div>
      )}

      {isEditing && (
        <div className="skills-editor">
          {categoriesError && (
            <p className="form-error">Couldn't load skill list. You can still edit levels below.</p>
          )}

          {draft.map((skill, i) => (
            <div key={i} className="skills-editor__row">
              {categoriesError ? (
                // Fallback so editing isn't blocked if categories fail to load
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. React Developer"
                  value={skill.name}
                  maxLength={50}
                  onChange={(e) => updateSkillField(i, 'name', e.target.value)}
                />
              ) : (
                <select
                  className="input-field"
                  value={skill.name}
                  disabled={categoriesLoading}
                  onChange={(e) => updateSkillField(i, 'name', e.target.value)}
                >
                  <option value="" disabled>
                    {categoriesLoading ? 'Loading skills…' : 'Select a skill'}
                  </option>
                  {categories?.map((cat) => {
                    const options = (cat.skills || []).filter(
                      (name) => name === skill.name || !selectedNames.has(name)
                    );
                    if (options.length === 0) return null;
                    return (
                      <optgroup key={cat._id} label={cat.name}>
                        {options.map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </optgroup>
                    );
                  })}
                </select>
              )}

              <select
                className="input-field"
                value={skill.level}
                onChange={(e) => updateSkillField(i, 'level', e.target.value)}
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-icon btn-danger"
                onClick={() => removeSkill(i)}
                aria-label="Remove skill"
              >
                ✕
              </button>
            </div>
          ))}

          {draft.length < 30 && (
            <button type="button" className="btn btn-outline" onClick={addSkill}>
              + Add Skill
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

export default SkillsSection;