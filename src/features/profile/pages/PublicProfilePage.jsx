// profile/pages/PublicProfilePage.jsx
//
// This is the CLIENT-FACING page — the one meant to impress. It uses
// ProfileHero (floating photo, headline) + ProfileSidebar (rate, status,
// rating, location, hire/message actions), and the polished *Display
// components (ExperienceDisplay, EducationDisplay, etc.) for the rest of
// the data — never the editable Section components' read-only branch,
// which were built for EditProfilePage's plain form layout, not for a
// page a client is browsing.
//
// MESSAGE CHANGE: "Send Message" no longer routes to an internal
// /messages/new page. It builds a mailto: link (using the freelancer's
// profile.email) and opens it, so clicking the button hands off straight
// to the client's own email app with a pre-filled subject/recipient.
//
// LAYOUT: two-column — a narrower main content column for Hero/About/
// Work/Experience/etc, and a sticky sidebar carrying the quick-glance
// facts + hire/message actions so they're always in view while
// scrolling. Collapses to a single column below `lg`, with the sidebar
// appearing after the hero.
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { usePublicProfile } from '../../../hooks/useProfile';
import MainLayout from '../../../layouts/MainLayout';
import {
  ProfileHero,
  ProfileSidebar,
  AboutSection,
  RecentWork,
  ProofOfExcellence,
  ProfileCTA,
  ExperienceDisplay,
  EducationDisplay,
  LanguagesDisplay,
  CertificationsDisplay,
  SocialDisplay,
  PreferencesDisplay,
} from '../components/ProfileDetailsSections';

const PublicProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile, isLoading, isError } = usePublicProfile(id);

  if (isLoading) return (
    <MainLayout>
      <div className="page-loading">Loading profile...</div>
    </MainLayout>
  );

  if (isError || !profile) return (
    <MainLayout>
      <div className="page-error">Profile not found or hidden.</div>
    </MainLayout>
  );

  const isOwnProfile = user?._id && profile._id && user._id === profile.userId;
  if (isOwnProfile) {
    navigate('/profile/me', { replace: true });
    return null;
  }

  const goToHire = () => navigate(`/profile/${id}/hire`);

  // Opens the visitor's own email client with the freelancer's address
  // pre-filled, instead of navigating to an internal messaging page.
  // CHANGE `profile.email` below if your Profile schema names the field
  // differently (e.g. profile.contactEmail, profile.user?.email).
  const goToMessage = () => {
    const email = profile.email;
    if (!email) {
      alert(`${profile.fullName} hasn't listed a contact email yet.`);
      return;
    }
    const subject = encodeURIComponent(`Regarding your HireMe profile`);
    const body = encodeURIComponent(
      `Hi ${profile.fullName?.split(' ')[0] || ''},\n\nI came across your profile on HireMe and would like to discuss a project.\n\n`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-10 lg:items-start">
          {/* Main content — narrower, comfortable reading width */}
          <div className="min-w-0 space-y-8">
            <ProfileHero profile={profile} />

            <AboutSection bio={profile.bio} skills={profile.skills} />

            <RecentWork portfolio={profile.portfolio} editable={false} />

            <ProofOfExcellence stats={profile.stats} testimonial={profile.featuredReview} />

            <ExperienceDisplay experience={profile.experience} />
            <EducationDisplay education={profile.education} />
            <LanguagesDisplay languages={profile.languages} />
            <CertificationsDisplay certifications={profile.certifications} />
            <SocialDisplay social={profile.social} />
            <PreferencesDisplay profile={profile} />
          </div>

          {/* Sidebar — quick facts + actions, sticky while scrolling */}
          <aside className="mt-6 lg:mt-0">
            <div className="lg:sticky lg:top-24">
              <ProfileSidebar profile={profile} onHire={goToHire} onMessage={goToMessage} />
            </div>
          </aside>
        </div>

        <div className="mt-10">
          <ProfileCTA
            fullName={profile.fullName}
            onHire={goToHire}
            onMessage={goToMessage}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default PublicProfilePage;