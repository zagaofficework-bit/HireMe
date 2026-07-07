// profile/pages/EditProfilePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useMyProfile } from '../../../hooks/useProfile';
import {
  useCreateProfile,
  useUpdateBasic,
  useUpdateLocation,
  useUpdateContact,
  useUpdatePreferences,
  useToggleVisibility,
  useDeleteProfile,
} from '../../../hooks/useEditProfile';
import MainLayout from '../../../layouts/MainLayout';
import ProfileSectionSidebar from '../components/ProfileSectionSidebar';
import ProfileImageUploader from '../components/ProfileImageUploader';
import SkillsSection from '../components/SkillsSection';
import ExperienceSection from '../components/ExperienceSection';
import EducationSection from '../components/EducationSection';
import LanguagesSection from '../components/LanguagesSection';
import SocialSection from '../components/SocialSection';
import CertificationsSection from '../components/CertificationsSection';
import PortfolioSection from '../components/PortfolioSection';
// import PreferencesSection from '../components/PreferencesSection';
import { useToast, ToastContainer } from '../components/Toast';
import {
  validateBasic,
  validateLocation,
  validateContact,
  validatePreferences,
} from '../../../utils/profileValidation';

const SECTIONS = [
  { id: 'photo', label: 'Profile Photo', icon: '📷' },
  { id: 'basic', label: 'Basic Info', icon: '👤' },
  { id: 'location', label: 'Location', icon: '📍' },
  { id: 'contact', label: 'Contact', icon: '✉️' },
  { id: 'skills', label: 'Skills', icon: '🛠️' },
  { id: 'experience', label: 'Experience', icon: '💼' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'languages', label: 'Languages', icon: '🗣️' },
  { id: 'certifications', label: 'Certifications', icon: '📜' },
  { id: 'portfolio', label: 'Projects', icon: '🧩' },
  { id: 'social', label: 'Social Links', icon: '🔗' },
  { id: 'preferences', label: 'Work Preferences', icon: '⚙️' },
  { id: 'danger', label: 'Danger Zone', icon: '⚠️', danger: true },
];

// Every section except Basic Info needs a profile document (an id) to
// attach to. Until the profile is created, those tabs are locked.
const LOCKED_UNTIL_CREATED = SECTIONS.map((s) => s.id).filter((id) => id !== 'basic');

const emptyBasic = { fullName: '', age: '', gender: '', bio: '', category: '' };
const emptyLocation = { country: '', state: '', city: '' };
const emptyContact = { email: '', phone: '' };
const emptyPrefs = {
  workType: '', jobType: '', availability: '',
  expectedSalary: { min: '', max: '', currency: 'INR' },
  hourlyRate: { amount: '', currency: 'INR' },
};

// ── Inline field error ────────────────────────────────────────────────────────
const FieldError = ({ msg }) =>
  msg ? <p className="form-error" style={{ marginTop: '0.25rem' }}>{msg}</p> : null;

// ── Completion check — which sections have real data ─────────────────────────
const getSectionCompletion = (profile) => ({
  photo: !!profile?.profileImage?.url,
  basic: !!profile?.fullName,
  location: !!(profile?.location?.city || profile?.location?.country),
  contact: !!(profile?.contact?.email || profile?.contact?.phone),
  skills: (profile?.skills?.length || 0) > 0,
  experience: (profile?.experience?.length || 0) > 0,
  education: (profile?.education?.length || 0) > 0,
  languages: (profile?.languages?.length || 0) > 0,
  certifications: (profile?.certifications?.length || 0) > 0,
  portfolio: (profile?.portfolio?.length || 0) > 0,
  social: !!(profile?.social?.linkedin || profile?.social?.github || profile?.social?.website),
  // FIX: workType/jobType/availability/expectedSalary/hourlyRate are
  // TOP-LEVEL Profile fields on the backend (see profile.service.js
  // calculateCompletion: `!!profile.workType`), not nested under a
  // `preferences` sub-object. Reading `profile.preferences.workType`
  // was always undefined, so this dot never went green even after a
  // successful save.
  preferences: !!(profile?.workType || profile?.availability),
});

const REQUIRED_SECTIONS = ['basic', 'skills', 'preferences'];

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile, isLoading, isError, error } = useMyProfile();
  const { toasts, show: showToast, dismiss } = useToast();

  const notFound = isError && error?.response?.status === 404;

  const [activeSection, setActiveSection] = useState('photo');
  const [basicDraft, setBasicDraft] = useState(emptyBasic);
  const [locationDraft, setLocationDraft] = useState(emptyLocation);
  const [contactDraft, setContactDraft] = useState(emptyContact);
  const [prefsDraft, setPrefsDraft] = useState(emptyPrefs);

  // Per-form validation errors
  const [basicErrors, setBasicErrors] = useState({});
  const [locationErrors, setLocationErrors] = useState({});
  const [contactErrors, setContactErrors] = useState({});
  const [prefsErrors, setPrefsErrors] = useState({});


  // No profile yet → start on Basic Info, since that's the only
  // section that's actually reachable before creation.
  useEffect(() => {
    if (notFound) setActiveSection('basic');
  }, [notFound]);

  // Sync drafts when profile loads / updates
  useEffect(() => {
    if (!profile) return;
    setBasicDraft({
      fullName: profile.fullName || '',
      age: profile.age || '',
      gender: profile.gender || '',
      bio: profile.bio || '',
      category: profile.category || '',
    });
    setLocationDraft({
      country: profile.location?.country || '',
      state: profile.location?.state || '',
      city: profile.location?.city || '',
    });
    setContactDraft({
      email: profile.contact?.email || '',
      phone: profile.contact?.phone || '',
    });
    setPrefsDraft({
      // FIX: these are top-level Profile fields, not nested under
      // `profile.preferences`. Reading the nested path meant the form
      // always reset to empty after a save + refetch.
      workType: profile.workType || '',
      jobType: profile.jobType || '',
      availability: profile.availability || '',
      expectedSalary: {
        min: profile.expectedSalary?.min || '',
        max: profile.expectedSalary?.max || '',
        currency: profile.expectedSalary?.currency || 'INR',
      },
      hourlyRate: {
        amount: profile.hourlyRate?.amount || '',
        currency: profile.hourlyRate?.currency || 'INR',
      },
    });
  }, [profile]);

  // ── Mutations ───────────────────────────────────────────────────────────────
  const { mutate: createProfile, isPending: isCreating } = useCreateProfile({
    onSuccess: () => {
      showToast('Profile created!', 'success');
      navigate('/profile/edit', { replace: true });
    },
    onError: (e) => showToast(e?.response?.data?.message || 'Failed to create profile.', 'error'),
  });

  const { mutate: saveBasic, isPending: isSavingBasic } = useUpdateBasic({
    onSuccess: () => showToast('Basic info saved.', 'success'),
    onError: (e) => showToast(e?.response?.data?.message || 'Failed to save basic info.', 'error'),
  });

  const { mutate: saveLocation, isPending: isSavingLocation } = useUpdateLocation({
    onSuccess: () => showToast('Location saved.', 'success'),
    onError: (e) => showToast(e?.response?.data?.message || 'Failed to save location.', 'error'),
  });

  const { mutate: saveContact, isPending: isSavingContact } = useUpdateContact({
    onSuccess: () => showToast('Contact details saved.', 'success'),
    onError: (e) => showToast(e?.response?.data?.message || 'Failed to save contact.', 'error'),
  });

  const { mutate: savePreferences, isPending: isSavingPrefs } = useUpdatePreferences({
    onSuccess: () => showToast('Work preferences saved.', 'success'),
    onError: (e) => showToast(e?.response?.data?.message || 'Failed to save preferences.', 'error'),
  });

  const { mutate: toggleVisibility, isPending: isTogglingVisibility } = useToggleVisibility({
    onSuccess: () =>
      showToast(
        profile?.isVisible ? 'Profile unpublished — hidden from clients.' : 'Profile published! Clients can now find you.',
        'success'
      ),
    onError: (e) => showToast(e?.response?.data?.message || 'Failed to update visibility.', 'error'),
  });

  const { mutate: deleteProfile, isPending: isDeleting } = useDeleteProfile({
    onSuccess: () => navigate('/profile/me', { replace: true }),
    onError: (e) => showToast(e?.response?.data?.message || 'Failed.', 'error'),
  });

  // ── Publish profile ─────────────────────────────────────────────────────────
  // No admin review step — publishing just makes the profile visible to
  // clients on the platform (same isVisible flag as toggleVisibility above).
  // We still gate it behind the required sections so a near-empty profile
  // doesn't go live by accident.
  const handlePublishProfile = () => {
    const completion = getSectionCompletion(profile);
    const missing = REQUIRED_SECTIONS.filter((s) => !completion[s]);

    if (missing.length > 0) {
      const labels = missing.map((s) => SECTIONS.find((x) => x.id === s)?.label).join(', ');
      showToast(`Complete these sections first: ${labels}`, 'error');
      setActiveSection(missing[0]);
      return;
    }

    toggleVisibility();
  };

  // ── Create-profile submit (Basic Info form, before the profile exists) ──────
  const handleCreateProfile = (e) => {
    e.preventDefault();
    const { valid, errors } = validateBasic(basicDraft);
    setBasicErrors(errors);
    if (!valid) { showToast('Fix the errors below before saving.', 'error'); return; }
    setBasicErrors({});
    createProfile({
      fullName: basicDraft.fullName.trim(),
      age: basicDraft.age ? Number(basicDraft.age) : undefined,
      gender: basicDraft.gender || undefined,
      bio: basicDraft.bio || undefined,
      category: basicDraft.category || undefined,
    });
  };

  // ── Submit handlers with validation ────────────────────────────────────────
  const handleSaveBasic = (e) => {
    e.preventDefault();
    const { valid, errors } = validateBasic(basicDraft);
    setBasicErrors(errors);
    if (!valid) { showToast('Fix the errors below before saving.', 'error'); return; }
    setBasicErrors({});
    saveBasic({
      fullName: basicDraft.fullName.trim(),
      age: basicDraft.age ? Number(basicDraft.age) : undefined,
      gender: basicDraft.gender || undefined,
      bio: basicDraft.bio || undefined,
      category: basicDraft.category || undefined,
    });
  };

  const handleSaveLocation = (e) => {
    e.preventDefault();
    const { valid, errors } = validateLocation(locationDraft);
    setLocationErrors(errors);
    if (!valid) { showToast('Fix the errors below before saving.', 'error'); return; }
    setLocationErrors({});
    // FIX: pass locationDraft directly — updateLocation wraps it as { location }
    saveLocation(locationDraft);
  };

  const handleSaveContact = (e) => {
    e.preventDefault();
    const { valid, errors } = validateContact(contactDraft);
    setContactErrors(errors);
    if (!valid) { showToast('Fix the errors below before saving.', 'error'); return; }
    setContactErrors({});
    // FIX: pass contactDraft directly — updateContact wraps it as { contact }
    saveContact(contactDraft);
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    const { valid, errors } = validatePreferences(prefsDraft);
    setPrefsErrors(errors);
    if (!valid) { showToast('Fix the errors below before saving.', 'error'); return; }
    setPrefsErrors({});

    const payload = {
      ...(prefsDraft.workType && { workType: prefsDraft.workType }),
      ...(prefsDraft.jobType && { jobType: prefsDraft.jobType }),
      ...(prefsDraft.availability && { availability: prefsDraft.availability }),
      expectedSalary: {
        ...(prefsDraft.expectedSalary.min && { min: Number(prefsDraft.expectedSalary.min) }),
        ...(prefsDraft.expectedSalary.max && { max: Number(prefsDraft.expectedSalary.max) }),
        currency: prefsDraft.expectedSalary.currency || 'INR',
      },
      hourlyRate: {
        ...(prefsDraft.hourlyRate.amount && { amount: Number(prefsDraft.hourlyRate.amount) }),
        currency: prefsDraft.hourlyRate.currency || 'INR',
      },
    };

    savePreferences(payload);
  };

  // ── Section completion dots ─────────────────────────────────────────────────
  const completion = getSectionCompletion(profile);
  const totalRequired = REQUIRED_SECTIONS.length;
  const completedRequired = REQUIRED_SECTIONS.filter((s) => completion[s]).length;
  const allRequiredDone = completedRequired === totalRequired;

  // ── Loading state ────────────────────────────────────────────────────────────
  if (isLoading) return (
    <MainLayout>
      <div className="page-loading">Loading...</div>
    </MainLayout>
  );

  // ── First-time creation — same sidebar shell as edit, with everything
  //    except Basic Info locked until the profile actually exists ───────────────
  if (notFound) {
    return (
      <MainLayout>
        <div className="profile-page">
          <div className="profile-section__header" style={{ padding: '0 0.25rem' }}>
            <div>
              <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.35rem', fontWeight: 800 }}>
                Create Your Profile
              </h2>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Start with Basic Info — the rest unlocks once your profile is created.
              </p>
            </div>
          </div>

          <div className="edit-profile-layout">
            <ProfileSectionSidebar
              sections={SECTIONS}
              activeSection="basic"
              onSelect={() => {}}
              completion={{}}
              requiredIds={REQUIRED_SECTIONS}
              lockedIds={LOCKED_UNTIL_CREATED}
            />

            <div className="edit-profile-content">
              <section className="profile-section">
                <h3>Basic Info</h3>
                <form className="form-grid" onSubmit={handleCreateProfile} noValidate>
                  <div>
                    <input
                      className="input-field"
                      placeholder="Full name *"
                      value={basicDraft.fullName}
                      onChange={(e) => {
                        setBasicDraft((p) => ({ ...p, fullName: e.target.value }));
                        if (basicErrors.fullName) setBasicErrors((p) => ({ ...p, fullName: '' }));
                      }}
                    />
                    <FieldError msg={basicErrors.fullName} />
                  </div>

                  <div>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="Age (16–80)"
                      min={16}
                      max={80}
                      value={basicDraft.age}
                      onChange={(e) => {
                        setBasicDraft((p) => ({ ...p, age: e.target.value }));
                        if (basicErrors.age) setBasicErrors((p) => ({ ...p, age: '' }));
                      }}
                    />
                    <FieldError msg={basicErrors.age} />
                  </div>

                  <select
                    className="input-field"
                    value={basicDraft.gender}
                    onChange={(e) => setBasicDraft((p) => ({ ...p, gender: e.target.value }))}
                  >
                    <option value="">Gender (optional)</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>

                  <div className="form-grid__full">
                    <textarea
                      className="input-field"
                      placeholder="Short bio (max 1000 characters)"
                      maxLength={1000}
                      value={basicDraft.bio}
                      onChange={(e) => {
                        setBasicDraft((p) => ({ ...p, bio: e.target.value }));
                        if (basicErrors.bio) setBasicErrors((p) => ({ ...p, bio: '' }));
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <FieldError msg={basicErrors.bio} />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {basicDraft.bio.length}/1000
                      </span>
                    </div>
                  </div>

                  <button className="btn btn-primary" type="submit" disabled={isCreating}>
                    {isCreating ? 'Creating...' : 'Create Profile'}
                  </button>
                </form>
              </section>
            </div>
          </div>
        </div>
        <ToastContainer toasts={toasts} onDismiss={dismiss} />
      </MainLayout>
    );
  }

  if (isError) return (
    <MainLayout>
      <div className="page-error">Something went wrong loading your profile.</div>
    </MainLayout>
  );

  // ── Main edit page ──────────────────────────────────────────────────────────
  return (
    <MainLayout>
      <div className="profile-page">

        {/* Page header */}
        <div className="profile-section__header" style={{ padding: '0 0.25rem' }}>
          <div>
            <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.35rem', fontWeight: 800 }}>
              Edit Profile
            </h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {completedRequired}/{totalRequired} required sections completed
              {allRequiredDone && ' ✓'}
            </p>
          </div>
          <div className="edit-profile-page__top-actions" style={{ gap: '0.625rem' }}>
            {profile.isVisible ? (
              // Already live — a plain outline button just takes it down again.
              <button
                className="btn btn-outline"
                disabled={isTogglingVisibility}
                onClick={() => toggleVisibility()}
              >
                {isTogglingVisibility ? 'Updating...' : 'Unpublish Profile'}
              </button>
            ) : (
              // Not live yet — the primary CTA, gated on required sections.
              <button
                className={`btn ${allRequiredDone ? 'btn-primary' : 'btn-secondary'}`}
                disabled={isTogglingVisibility}
                onClick={handlePublishProfile}
                title={!allRequiredDone ? 'Complete Basic Info, Skills, and Preferences first' : ''}
              >
                {isTogglingVisibility ? 'Publishing...' : 'Publish Profile'}
              </button>
            )}
          </div>
        </div>

        {/* Visibility status banner */}
        {profile?.isVisible ? (
          <div style={{
            padding: '0.75rem 1rem', borderRadius: '0.75rem',
            background: 'rgba(47,212,126,0.08)', border: '1px solid rgba(47,212,126,0.25)',
            color: 'var(--success)', fontSize: '0.875rem', fontWeight: 500,
          }}>
            ✓ Your profile is live — clients can find and hire you.
          </div>
        ) : (
          <div style={{
            padding: '0.75rem 1rem', borderRadius: '0.75rem',
            background: 'rgba(240,169,58,0.08)', border: '1px solid rgba(240,169,58,0.25)',
            color: 'var(--warning)', fontSize: '0.875rem', fontWeight: 500,
          }}>
            👁️ Your profile is hidden. Publish it so clients can discover you.
          </div>
        )}

        {/* Sidebar + content */}
        <div className="edit-profile-layout">
          <ProfileSectionSidebar
            sections={SECTIONS}
            activeSection={activeSection}
            onSelect={setActiveSection}
            completion={completion}
            requiredIds={REQUIRED_SECTIONS}
            lockedIds={[]}
          />

          <div className="edit-profile-content">

            {/* ── Photo ── */}
            {activeSection === 'photo' && (
              <section className="profile-section">
                <h3>Profile Photo</h3>
                <ProfileImageUploader currentImage={profile.profileImage?.url} />
              </section>
            )}

            {/* ── Basic Info ── */}
            {activeSection === 'basic' && (
              <section className="profile-section">
                <h3>Basic Info</h3>
                <form className="form-grid" onSubmit={handleSaveBasic} noValidate>
                  <div>
                    <input
                      className="input-field"
                      placeholder="Full name *"
                      value={basicDraft.fullName}
                      onChange={(e) => {
                        setBasicDraft((p) => ({ ...p, fullName: e.target.value }));
                        if (basicErrors.fullName) setBasicErrors((p) => ({ ...p, fullName: '' }));
                      }}
                    />
                    <FieldError msg={basicErrors.fullName} />
                  </div>

                  <div>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="Age (16–80)"
                      min={16}
                      max={80}
                      value={basicDraft.age}
                      onChange={(e) => {
                        setBasicDraft((p) => ({ ...p, age: e.target.value }));
                        if (basicErrors.age) setBasicErrors((p) => ({ ...p, age: '' }));
                      }}
                    />
                    <FieldError msg={basicErrors.age} />
                  </div>

                  <select
                    className="input-field"
                    value={basicDraft.gender}
                    onChange={(e) => setBasicDraft((p) => ({ ...p, gender: e.target.value }))}
                  >
                    <option value="">Gender (optional)</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>

                  <div className="form-grid__full">
                    <textarea
                      className="input-field"
                      placeholder="Bio (max 1000 characters)"
                      maxLength={1000}
                      value={basicDraft.bio}
                      onChange={(e) => {
                        setBasicDraft((p) => ({ ...p, bio: e.target.value }));
                        if (basicErrors.bio) setBasicErrors((p) => ({ ...p, bio: '' }));
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <FieldError msg={basicErrors.bio} />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {basicDraft.bio.length}/1000
                      </span>
                    </div>
                  </div>

                  <button className="btn btn-primary" type="submit" disabled={isSavingBasic}>
                    {isSavingBasic ? 'Saving...' : 'Save Basic Info'}
                  </button>
                </form>
              </section>
            )}

            {/* ── Location ── */}
            {activeSection === 'location' && (
              <section className="profile-section">
                <h3>Location</h3>
                <form className="form-grid" onSubmit={handleSaveLocation} noValidate>
                  <div>
                    <input
                      className="input-field"
                      placeholder="City *"
                      value={locationDraft.city}
                      onChange={(e) => {
                        setLocationDraft((p) => ({ ...p, city: e.target.value }));
                        if (locationErrors.city) setLocationErrors((p) => ({ ...p, city: '' }));
                      }}
                    />
                    <FieldError msg={locationErrors.city} />
                  </div>

                  <div>
                    <input
                      className="input-field"
                      placeholder="State / Province"
                      value={locationDraft.state}
                      onChange={(e) => {
                        setLocationDraft((p) => ({ ...p, state: e.target.value }));
                        if (locationErrors.state) setLocationErrors((p) => ({ ...p, state: '' }));
                      }}
                    />
                    <FieldError msg={locationErrors.state} />
                  </div>

                  <div>
                    <input
                      className="input-field"
                      placeholder="Country"
                      value={locationDraft.country}
                      onChange={(e) => {
                        setLocationDraft((p) => ({ ...p, country: e.target.value }));
                        if (locationErrors.country) setLocationErrors((p) => ({ ...p, country: '' }));
                      }}
                    />
                    <FieldError msg={locationErrors.country} />
                  </div>

                  <button className="btn btn-primary" type="submit" disabled={isSavingLocation}>
                    {isSavingLocation ? 'Saving...' : 'Save Location'}
                  </button>
                </form>
              </section>
            )}

            {/* ── Contact ── */}
            {activeSection === 'contact' && (
              <section className="profile-section">
                <h3>Contact Details</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.75rem' }}>
                  Contact details are only visible to verified clients.
                </p>
                <form className="form-grid" onSubmit={handleSaveContact} noValidate>
                  <div>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="Email address"
                      value={contactDraft.email}
                      onChange={(e) => {
                        setContactDraft((p) => ({ ...p, email: e.target.value }));
                        if (contactErrors.email) setContactErrors((p) => ({ ...p, email: '' }));
                      }}
                    />
                    <FieldError msg={contactErrors.email} />
                  </div>

                  <div>
                    <input
                      className="input-field"
                      placeholder="Phone (e.g. +919876543210)"
                      value={contactDraft.phone}
                      onChange={(e) => {
                        setContactDraft((p) => ({ ...p, phone: e.target.value }));
                        if (contactErrors.phone) setContactErrors((p) => ({ ...p, phone: '' }));
                      }}
                    />
                    <FieldError msg={contactErrors.phone} />
                  </div>

                  <button className="btn btn-primary" type="submit" disabled={isSavingContact}>
                    {isSavingContact ? 'Saving...' : 'Save Contact'}
                  </button>
                </form>
              </section>
            )}

            {/* ── Section components (own edit state) ── */}
            {activeSection === 'skills' && <SkillsSection skills={profile.skills} editable />}
            {activeSection === 'experience' && <ExperienceSection experience={profile.experience} editable />}
            {activeSection === 'education' && <EducationSection education={profile.education} editable />}
            {activeSection === 'languages' && <LanguagesSection languages={profile.languages} editable />}
            {activeSection === 'certifications' && <CertificationsSection certifications={profile.certifications} editable />}
            {activeSection === 'portfolio' && <PortfolioSection portfolio={profile.portfolio} editable />}
            {activeSection === 'social' && <SocialSection social={profile.social} editable />}

            {/* ── Work Preferences (controlled here, not delegated to PreferencesSection) ── */}
            {activeSection === 'preferences' && (
              <section className="profile-section">
                <h3>Work Preferences</h3>
                <form className="preferences-editor" onSubmit={handleSavePreferences} noValidate>

                  <div className="form-row">
                    <label>Work Type</label>
                    <div style={{ flex: 1 }}>
                      <select
                        className="input-field"
                        value={prefsDraft.workType}
                        onChange={(e) => {
                          setPrefsDraft((p) => ({ ...p, workType: e.target.value }));
                          if (prefsErrors.workType) setPrefsErrors((p) => ({ ...p, workType: '' }));
                        }}
                      >
                        <option value="">Select...</option>
                        <option value="remote">Remote</option>
                        <option value="onsite">On-site</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                      <FieldError msg={prefsErrors.workType} />
                    </div>
                  </div>

                  <div className="form-row">
                    <label>Job Type</label>
                    <div style={{ flex: 1 }}>
                      <select
                        className="input-field"
                        value={prefsDraft.jobType}
                        onChange={(e) => {
                          setPrefsDraft((p) => ({ ...p, jobType: e.target.value }));
                          if (prefsErrors.jobType) setPrefsErrors((p) => ({ ...p, jobType: '' }));
                        }}
                      >
                        <option value="">Select...</option>
                        <option value="fulltime">Full-time</option>
                        <option value="parttime">Part-time</option>
                        <option value="freelance">Freelance</option>
                        <option value="internship">Internship</option>
                      </select>
                      <FieldError msg={prefsErrors.jobType} />
                    </div>
                  </div>

                  <div className="form-row">
                    <label>Availability</label>
                    <div style={{ flex: 1 }}>
                      <select
                        className="input-field"
                        value={prefsDraft.availability}
                        onChange={(e) => {
                          setPrefsDraft((p) => ({ ...p, availability: e.target.value }));
                          if (prefsErrors.availability) setPrefsErrors((p) => ({ ...p, availability: '' }));
                        }}
                      >
                        <option value="">Select...</option>
                        <option value="immediate">Immediate</option>
                        <option value="one_week">1 Week</option>
                        <option value="two_weeks">2 Weeks</option>
                        <option value="one_month">1 Month</option>
                        <option value="not_available">Not Available</option>
                      </select>
                      <FieldError msg={prefsErrors.availability} />
                    </div>
                  </div>

                  <div className="form-row">
                    <label>Expected Salary</label>
                    <div style={{ flex: 1, display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 100 }}>
                        <input
                          type="number"
                          className="input-field"
                          placeholder="Min (INR)"
                          min={0}
                          value={prefsDraft.expectedSalary.min}
                          onChange={(e) => {
                            setPrefsDraft((p) => ({ ...p, expectedSalary: { ...p.expectedSalary, min: e.target.value } }));
                            if (prefsErrors.salaryMin) setPrefsErrors((p) => ({ ...p, salaryMin: '' }));
                          }}
                        />
                        <FieldError msg={prefsErrors.salaryMin} />
                      </div>
                      <div style={{ flex: 1, minWidth: 100 }}>
                        <input
                          type="number"
                          className="input-field"
                          placeholder="Max (INR)"
                          min={0}
                          value={prefsDraft.expectedSalary.max}
                          onChange={(e) => {
                            setPrefsDraft((p) => ({ ...p, expectedSalary: { ...p.expectedSalary, max: e.target.value } }));
                            if (prefsErrors.salaryMax) setPrefsErrors((p) => ({ ...p, salaryMax: '' }));
                          }}
                        />
                        <FieldError msg={prefsErrors.salaryMax} />
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <label>Hourly Rate</label>
                    <div style={{ flex: 1 }}>
                      <input
                        type="number"
                        className="input-field"
                        placeholder="Amount (INR/hr)"
                        min={0}
                        value={prefsDraft.hourlyRate.amount}
                        onChange={(e) => {
                          setPrefsDraft((p) => ({ ...p, hourlyRate: { ...p.hourlyRate, amount: e.target.value } }));
                          if (prefsErrors.hourlyRate) setPrefsErrors((p) => ({ ...p, hourlyRate: '' }));
                        }}
                      />
                      <FieldError msg={prefsErrors.hourlyRate} />
                    </div>
                  </div>

                  <div className="profile-section__actions">
                    <button className="btn btn-primary" type="submit" disabled={isSavingPrefs}>
                      {isSavingPrefs ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </div>
                </form>
              </section>
            )}

            {/* ── Danger Zone ── */}
            {activeSection === 'danger' && (
              <section className="profile-section danger-zone">
                <h3>Danger Zone</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0 0 1rem' }}>
                  These actions are permanent or affect your profile's visibility.
                </p>
                <button
                  className="btn btn-danger"
                  disabled={isDeleting}
                  onClick={() => {
                    if (window.confirm('This will permanently delete your profile. Are you sure?')) {
                      deleteProfile();
                    }
                  }}
                >
                  {isDeleting ? 'Deleting...' : 'Delete my profile'}
                </button>
              </section>
            )}

          </div>
        </div>

        {/* Bottom nudge — shown when required sections aren't done yet */}
        {!allRequiredDone && (
          <div style={{
            padding: '1rem 1.25rem', borderRadius: '1rem',
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '1rem', flexWrap: 'wrap',
          }}>
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                Complete your profile to get discovered
              </p>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Required: Basic Info, Skills, Work Preferences
                ({completedRequired}/{totalRequired} done)
              </p>
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => setActiveSection(REQUIRED_SECTIONS.find((s) => !completion[s]) || 'basic')}
            >
              Continue →
            </button>
          </div>
        )}

      </div>

      {/* Toast portal */}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </MainLayout>
  );
};

export default EditProfilePage;