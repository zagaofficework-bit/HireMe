// profile/pages/MyProfilePage.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useMyProfile } from '../../../hooks/useProfile';
import { useIncomingHireRequests } from "../../../hooks/useHire";
import MainLayout from '../../../layouts/MainLayout';
import {  ProfileCardCompact } from '../components/ProfileCardCompact';
import {
  AboutSection,
  RecentWork,
  ProofOfExcellence,
  ExperienceDisplay,
  EducationDisplay,
  LanguagesDisplay,
  CertificationsDisplay,
  SocialDisplay,
  PreferencesDisplay,
} from '../components/ProfileDetailsSections';

const MyProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile, isLoading, isError, error } = useMyProfile();

  // Accepted hire requests = "currently working with" engagements. This is a
  // read-only banner, so a quiet failure here shouldn't block the rest of the
  // page — hence no isError handling on this one, just default to [].
  const { data: incomingRequests = [] } = useIncomingHireRequests();
  const activeEngagements = incomingRequests.filter((r) => r.status === 'accepted');

  if (isLoading) return (
    <MainLayout>
      <div className="page-loading">Loading your profile...</div>
    </MainLayout>
  );

  if (isError) {
    if (error?.response?.status === 404) {
      return (
        <MainLayout>
          <div className="empty-state-page">
            <h2>You haven't created a profile yet</h2>
            <p>Set up your profile so clients can find and hire you.</p>
            <button className="btn btn-primary" onClick={() => navigate('/profile/edit')}>
              Create Profile
            </button>
          </div>
        </MainLayout>
      );
    }
    return (
      <MainLayout>
        <div className="page-error">Couldn't load your profile. Please try again.</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {activeEngagements.length > 0 && (
          <div
            style={{
              padding: '0.9rem 1.1rem',
              borderRadius: '0.9rem',
              background: 'rgba(47,212,126,0.08)',
              border: '1px solid rgba(47,212,126,0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
            }}
          >
            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: 'var(--success)' }}>
              🤝 Currently working with
            </p>
            {activeEngagements.map((r) => (
              <p key={r._id} style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                {r.client?.companyName || r.client?.fullName || 'A client'}
              </p>
            ))}
          </div>
        )}

        <ProfileCardCompact
          profile={profile}
          onEditClick={() => navigate('/profile/edit')}
        />

        <AboutSection bio={profile.bio} skills={profile.skills} />

        <RecentWork
          portfolio={profile.portfolio}
          editable
          onAddClick={() => navigate('/profile/edit')}
        />

        <ProofOfExcellence stats={profile.stats} testimonial={profile.featuredReview} />

        {/* Read-only, polished display versions — matches the same design
           language a client sees on PublicProfilePage. The edit forms for
           this same data live only inside EditProfilePage now. */}
        <ExperienceDisplay experience={profile.experience} />
        <EducationDisplay education={profile.education} />
        <LanguagesDisplay languages={profile.languages} />
        <CertificationsDisplay certifications={profile.certifications} />
        <SocialDisplay social={profile.social} />
        <PreferencesDisplay profile={profile} />
      </div>
    </MainLayout>
  );
};

export default MyProfilePage;