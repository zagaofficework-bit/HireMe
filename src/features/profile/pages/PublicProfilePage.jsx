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
// CALL FIX: ProfileDetailsSections.jsx moved on from a mailto "Send
// Message" button to a `tel:` "Call" button — both ProfileSidebar and
// ProfileCTA now take `onCall`, not `onMessage`. This page hadn't been
// updated to match: ProfileSidebar was never given an `onCall` prop at
// all, and ProfileCTA was still being passed the old `onMessage`, which
// that component no longer reads. Both Call buttons were silently
// no-ops (`onClick={undefined}`). Replaced the old mailto `goToMessage`
// with a single `goToCall` (same fallback-alert pattern) and wired it
// to both components.
//
// NOTE: assumes phone lives at `profile.contact?.phone`, matching the
// `updateContact({ contact })` wrapper shape in profile.api.js. If your
// Profile schema actually stores it flat as `profile.phone`, change the
// one line marked below.
//
// LAYOUT: two-column — a narrower main content column for Hero/About/
// Work/Experience/etc, and a sticky sidebar carrying the quick-glance
// facts + hire/message actions so they're always in view while
// scrolling. Collapses to a single column below `lg`, with the sidebar
// appearing after the hero.
//
// REVIEWS: ReviewsCarousel ("What Clients Say") added directly after
// PreferencesDisplay — featured reviews + a "View all reviews" button
// that routes to /profile/:id/reviews (FreelancerReviewsPage).
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { usePublicProfile } from '../../../hooks/useProfile';
import MainLayout from '../../../layouts/MainLayout';
import ReviewsCarousel from "../../review/components/ReviewsCarousel";
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

  // Opens the visitor's phone dialer with the freelancer's number.
  // CHANGE `profile.contact?.phone` below if your Profile schema stores
  // it flat (e.g. `profile.phone`) instead of nested under `contact`.
  const goToCall = () => {
    const phone = profile.contact?.phone;
    if (!phone) {
      alert(`${profile.fullName} hasn't listed a phone number yet.`);
      return;
    }
    window.location.href = `tel:${phone}`;
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
              <ProfileSidebar
                profile={profile}
                onHire={goToHire}
                onCall={goToCall}
              />
            </div>
          </aside>
        </div>

        {/* Full width — outside the two-column grid so it isn't
            squeezed by the sidebar's 300px column. */}
        <div className="mt-10">
          <ReviewsCarousel profileId={id} profile={profile} />
        </div>

        <div className="mt-10">
          <ProfileCTA
            fullName={profile.fullName}
            onHire={goToHire}
            onCall={goToCall}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default PublicProfilePage;