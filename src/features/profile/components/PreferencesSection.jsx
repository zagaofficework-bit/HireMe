// profile/components/PreferencesSection.jsx
//
// FIX: work preference fields (workType, jobType, availability,
// expectedSalary, hourlyRate) are TOP-LEVEL fields on the Profile
// model, not nested under `profile.preferences`. This component now
// takes the whole `profile` object (not `profile.preferences`) so it
// reads from the right place — update the caller in MyProfilePage.jsx
// from `<PreferencesSection preferences={profile.preferences} />` to
// `<PreferencesSection profile={profile} />`.
import { useState } from 'react';
import { useUpdatePreferences } from '../../../hooks/useEditProfile';

const WORK_TYPES = ['remote', 'onsite', 'hybrid'];
const JOB_TYPES = ['fulltime', 'parttime', 'freelance', 'internship'];
const AVAILABILITY = ['immediate', 'one_week', 'two_weeks', 'one_month', 'not_available'];

const defaultDraft = (profile) => ({
  workType: profile?.workType || '',
  jobType: profile?.jobType || '',
  availability: profile?.availability || '',
  expectedSalary: {
    min: profile?.expectedSalary?.min || '',
    max: profile?.expectedSalary?.max || '',
    currency: profile?.expectedSalary?.currency || 'INR',
  },
  hourlyRate: {
    amount: profile?.hourlyRate?.amount || '',
    currency: profile?.hourlyRate?.currency || 'INR',
  },
});

const formatLabel = (value) => value.replace(/_/g, ' ');

const PreferencesSection = ({ profile = {}, editable = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(defaultDraft(profile));
  const { mutate: savePreferences, isPending, error } = useUpdatePreferences({
    onSuccess: () => setIsEditing(false),
  });

  const startEdit = () => {
    setDraft(defaultDraft(profile));
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraft(defaultDraft(profile));
    setIsEditing(false);
  };

  const handleSave = () => {
    // Flat payload — matches updatePreferencesSchema and updateSection
    // on the backend exactly (no `{ preferences: ... }` wrapper).
    const payload = {
      ...(draft.workType && { workType: draft.workType }),
      ...(draft.jobType && { jobType: draft.jobType }),
      ...(draft.availability && { availability: draft.availability }),
      expectedSalary: {
        min: draft.expectedSalary.min ? Number(draft.expectedSalary.min) : undefined,
        max: draft.expectedSalary.max ? Number(draft.expectedSalary.max) : undefined,
        currency: draft.expectedSalary.currency,
      },
      hourlyRate: {
        amount: draft.hourlyRate.amount ? Number(draft.hourlyRate.amount) : undefined,
        currency: draft.hourlyRate.currency,
      },
    };
    savePreferences(payload);
  };

  return (
    <section className="profile-section">
      <div className="profile-section__header">
        <h3>Work Preferences</h3>
        {editable && !isEditing && (
          <button className="btn btn-link" onClick={startEdit}>Edit</button>
        )}
      </div>

      {error && <p className="form-error">{error.response?.data?.message || 'Failed to save preferences.'}</p>}

      {!isEditing && (
        <div className="preferences-view">
          <div className="preferences-view__row"><strong>Work type:</strong> {profile.workType ? formatLabel(profile.workType) : '—'}</div>
          <div className="preferences-view__row"><strong>Job type:</strong> {profile.jobType ? formatLabel(profile.jobType) : '—'}</div>
          <div className="preferences-view__row"><strong>Availability:</strong> {profile.availability ? formatLabel(profile.availability) : '—'}</div>
          <div className="preferences-view__row">
            <strong>Expected salary:</strong>{' '}
            {profile.expectedSalary?.min || profile.expectedSalary?.max
              ? `${profile.expectedSalary.currency || 'INR'} ${profile.expectedSalary.min || 0} – ${profile.expectedSalary.max || 0}`
              : '—'}
          </div>
          <div className="preferences-view__row">
            <strong>Hourly rate:</strong>{' '}
            {profile.hourlyRate?.amount
              ? `${profile.hourlyRate.currency || 'INR'} ${profile.hourlyRate.amount}/hr`
              : '—'}
          </div>
        </div>
      )}

      {isEditing && (
        <div className="preferences-editor">
          <div className="form-row">
            <label>Work Type</label>
            <select className="input-field" value={draft.workType} onChange={(e) => setDraft((p) => ({ ...p, workType: e.target.value }))}>
              <option value="">Select...</option>
              {WORK_TYPES.map((t) => <option key={t} value={t}>{formatLabel(t)}</option>)}
            </select>
          </div>

          <div className="form-row">
            <label>Job Type</label>
            <select className="input-field" value={draft.jobType} onChange={(e) => setDraft((p) => ({ ...p, jobType: e.target.value }))}>
              <option value="">Select...</option>
              {JOB_TYPES.map((t) => <option key={t} value={t}>{formatLabel(t)}</option>)}
            </select>
          </div>

          <div className="form-row">
            <label>Availability</label>
            <select className="input-field" value={draft.availability} onChange={(e) => setDraft((p) => ({ ...p, availability: e.target.value }))}>
              <option value="">Select...</option>
              {AVAILABILITY.map((t) => <option key={t} value={t}>{formatLabel(t)}</option>)}
            </select>
          </div>

          <div className="form-row">
            <label>Expected Salary (min – max)</label>
            <input type="number" className="input-field" placeholder="Min" value={draft.expectedSalary.min}
              onChange={(e) => setDraft((p) => ({ ...p, expectedSalary: { ...p.expectedSalary, min: e.target.value } }))} />
            <input type="number" className="input-field" placeholder="Max" value={draft.expectedSalary.max}
              onChange={(e) => setDraft((p) => ({ ...p, expectedSalary: { ...p.expectedSalary, max: e.target.value } }))} />
          </div>

          <div className="form-row">
            <label>Hourly Rate</label>
            <input type="number" className="input-field" placeholder="Amount" value={draft.hourlyRate.amount}
              onChange={(e) => setDraft((p) => ({ ...p, hourlyRate: { ...p.hourlyRate, amount: e.target.value } }))} />
          </div>

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

export default PreferencesSection;