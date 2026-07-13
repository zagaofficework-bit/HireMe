// src/features/reviews/pages/FreelancerReviewsPage.jsx
//
// Route: /profile/:id/reviews
// Full, client-facing list of every review left on one freelancer's
// profile. Reached via the "View all reviews" button on ReviewsCarousel
// (shown on PublicProfilePage). Masonry-style grid, sort control, and
// "Load more" pagination.
//
// Data shape assumption: same as ReviewsCarousel — useProfileReviews
// resolves to either an array or { reviews, stats: { avgRating, count },
// totalPages }. Adjust `normalize()` if reviews.api.js differs.
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import ReviewCard from '../components/ReviewCard';
import StarRating from '../components/StarRating';
import { useProfileReviews } from '../../../hooks/useReviews';
import { usePublicProfile, useMyProfile } from '../../../hooks/useProfile';

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'highest', label: 'Highest rated' },
  { value: 'lowest', label: 'Lowest rated' },
];

// Matches reviews.api.js -> fetchProfileReviews, which resolves to
// `data.data` = { reviews, pagination }. avgRating isn't returned by
// that endpoint, so it's preferred from profile.stats (if your Profile
// model tracks it) and otherwise averaged from the reviews loaded so far.
const normalize = (data, profile, loadedCount) => {
  const reviews = data?.reviews || [];
  const pagination = data?.pagination || {};
  const count = pagination.total ?? profile?.stats?.reviewCount ?? reviews.length;
  const avgRating = profile?.stats?.avgRating ?? (loadedCount
    ? undefined // filled in by caller from the full accumulated list
    : 0);
  const hasMore = pagination.page && pagination.totalPages
    ? pagination.page < pagination.totalPages
    : false;
  return { reviews, count, avgRating, hasMore };
};

const FreelancerReviewsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // "/profile/me/reviews" — navbar link, freelancer viewing feedback on
  // their own profile. "/profile/:id/reviews" — public, reached via the
  // "View more" button on someone else's profile. Same page, different
  // profile source.
  const isOwnProfile = id === 'me';
  const { data: myProfile } = useMyProfile();
  const { data: otherProfile } = usePublicProfile(isOwnProfile ? undefined : id);
  const profile = isOwnProfile ? myProfile : otherProfile;
  const reviewsProfileId = isOwnProfile ? myProfile?._id : id;
  const profileLink = isOwnProfile ? '/profile/me' : `/profile/${id}`;

  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [allReviews, setAllReviews] = useState([]);

  const { data, isLoading, isFetching, isError } = useProfileReviews(reviewsProfileId, {
    page,
    limit: PAGE_SIZE,
    sortBy,
  });

  const { count, hasMore } = normalize(data, profile);
  const pageReviews = data?.reviews || [];
  const avgRating = profile?.stats?.avgRating ?? (allReviews.length
    ? allReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / allReviews.length
    : 0);

  // Accumulate pages for "Load more"; reset when sort changes.
  useEffect(() => {
    setAllReviews((prev) => (page === 1 ? pageReviews : [...prev, ...pageReviews]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleSortChange = (value) => {
    setSortBy(value);
    setPage(1);
    setAllReviews([]);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ border: '1px solid var(--border-strong)', color: 'var(--text-secondary)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black font-display" style={{ color: 'var(--text-primary)' }}>
            Reviews{profile?.fullName ? ` for ${profile.fullName}` : ''}
          </h1>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap mb-8 ml-12">
          <div className="flex items-center gap-2">
            <StarRating value={avgRating} showValue count={count} size="md" />
          </div>

          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="theme-input rounded-lg px-3 py-2 text-sm font-medium"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Loading (first page) */}
        {isLoading && page === 1 && (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="theme-card p-5 h-40 mb-4 break-inside-avoid animate-pulse" />
            ))}
          </div>
        )}

        {isError && (
          <div className="theme-card p-10 text-center text-sm" style={{ color: 'var(--danger)' }}>
            Couldn't load reviews for this profile. Please try again later.
          </div>
        )}

        {!isLoading && !isError && allReviews.length === 0 && (
          <div className="theme-card p-14 text-center">
            <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              No reviews yet
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              This professional hasn't received any client reviews so far.
            </p>
          </div>
        )}

        {allReviews.length > 0 && (
          <>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
              {allReviews.map((review) => (
                <div key={review._id} className="break-inside-avoid mb-4">
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-6">
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={isFetching}
                  className="btn btn-secondary"
                >
                  {isFetching ? 'Loading…' : 'Load more reviews'}
                </button>
              </div>
            )}
          </>
        )}

        <div className="mt-10">
          <Link to={profileLink} className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
            ← Back to profile
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default FreelancerReviewsPage;