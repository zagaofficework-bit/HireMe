// src/features/reviews/components/ReviewsCarousel.jsx
//
// "What Clients Say" — featured-review carousel for the public,
// client-facing profile page. Auto-rotates, has prev/next arrows,
// and a "View all reviews" button that goes to the freelancer's
// full reviews page (/profile/:id/reviews).
//
// Data shape assumption: useProfileReviews(profileId, opts) resolves
// to either a plain array of reviews, or an object like
// { reviews: [...], stats: { avgRating, count } }. Both are handled
// below — adjust the `normalize()` block if your reviews.api.js
// returns something different.
import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ReviewCard from './ReviewCard';
import StarRating from './StarRating';
import { useProfileReviews } from '../../../hooks/useReviews';

const AUTO_ROTATE_MS = 5000;

// Matches reviews.api.js -> fetchProfileReviews, which resolves to
// `data.data` = { reviews, pagination }. There's no separate ratings
// endpoint, so avgRating is preferred from profile.stats (if your
// Profile model tracks it) and falls back to averaging the reviews
// actually returned on this page.
const normalize = (data, profile) => {
  const reviews = data?.reviews || [];
  const count = data?.pagination?.total ?? profile?.stats?.reviewCount ?? reviews.length;
  const avgRating = profile?.stats?.avgRating ?? (reviews.length
    ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
    : 0);
  return { reviews, avgRating, count };
};

const ReviewsCarousel = ({ profileId, profile }) => {
  const { data, isLoading, isError } = useProfileReviews(profileId, { limit: 9, sortBy: 'newest' });
  const { reviews, avgRating, count } = normalize(data, profile);

  const trackRef = useRef(null);
  const cardRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const scrollToIndex = useCallback((index) => {
    const track = trackRef.current;
    const card = cardRef.current;
    if (!track || !card) return;
    const cardWidth = card.offsetWidth + 16; // + gap
    const clamped = ((index % reviews.length) + reviews.length) % reviews.length;
    track.scrollTo({ left: clamped * cardWidth, behavior: 'smooth' });
    setActiveIndex(clamped);
  }, [reviews.length]);

  const goNext = useCallback(() => scrollToIndex(activeIndex + 1), [activeIndex, scrollToIndex]);
  const goPrev = useCallback(() => scrollToIndex(activeIndex - 1), [activeIndex, scrollToIndex]);

  // Auto-rotate
  useEffect(() => {
    if (paused || reviews.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % reviews.length;
        scrollToIndex(next);
        return next;
      });
    }, AUTO_ROTATE_MS);
    return () => clearInterval(timer);
  }, [paused, reviews.length, scrollToIndex]);

  // Keep activeIndex in sync if user manually scrolls/swipes
  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    const card = cardRef.current;
    if (!track || !card) return;
    const cardWidth = card.offsetWidth + 16;
    const index = Math.round(track.scrollLeft / cardWidth);
    setActiveIndex((prev) => (prev === index ? prev : index));
  }, []);

  if (isLoading) {
    return (
      <section>
        <div className="h-7 w-48 rounded animate-pulse mb-6" style={{ backgroundColor: 'var(--bg-elevated)' }} />
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="theme-card p-5 h-40 flex-1 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (isError || reviews.length === 0) {
    return null; // nothing worth showing on a client-facing page
  }

  return (
    <section>
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h2 className="text-2xl font-black font-display" style={{ color: 'var(--text-primary)' }}>
            What <span style={{ color: 'var(--accent)' }}>Clients Say</span>
          </h2>
          <div className="flex items-center gap-2 mt-1.5">
            <StarRating value={avgRating} showValue count={count} />
          </div>
        </div>

        {reviews.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              aria-label="Previous reviews"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ border: '1px solid var(--border-strong)', color: 'var(--text-secondary)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              aria-label="Next reviews"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div
        ref={trackRef}
        onScroll={handleScroll}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory"
      >
        {reviews.map((review, i) => (
          <div
            key={review._id}
            ref={i === 0 ? cardRef : undefined}
            className="snap-start flex-shrink-0 w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]"
          >
            <FeaturedReviewCard review={review} />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-7">
        <Link to={`/profile/${profileId}/reviews`} className="btn btn-secondary">
          View more
        </Link>
      </div>

      {/* Hides the native horizontal scrollbar on the track above — the
          custom prev/next arrows are the intended way to navigate, the
          browser's default scrollbar is just visual noise here. */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
    </section>
  );
};

// Quote-style card used inside the carousel — visually distinct from the
// plain ReviewCard used on MyReviewsPage / the full reviews grid, but
// reuses the same StarRating + theme tokens for consistency.
const FeaturedReviewCard = ({ review }) => {
  const name = review.reviewer?.name || 'Anonymous client';
  return (
    <div className="theme-card p-5 h-full flex flex-col gap-3">
      <svg width="28" height="20" viewBox="0 0 28 20" fill="none" style={{ color: 'var(--accent)', opacity: 0.4 }}>
        <path
          fill="currentColor"
          d="M0 20V11.2C0 7.6 0.8 4.667 2.4 2.4 4 0.133 6.267 0 9.2 0h1.6v4.4H9.2c-1.867 0-3.133 0.467-3.8 1.4-0.667 0.933-1 2.267-1 4h4.6V20H0zm14.8 0V11.2c0-3.6 0.8-6.533 2.4-8.8C18.8 0.133 21.067 0 24 0h1.6v4.4H24c-1.867 0-3.133 0.467-3.8 1.4-0.667 0.933-1 2.267-1 4h4.6V20h-9z"
        />
      </svg>
      <StarRating value={review.rating} size="sm" />
      <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text-secondary)' }}>
        {review.comment || 'No written feedback left.'}
      </p>
      <div className="flex items-center gap-3 pt-1">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
        >
          {name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')}
        </div>
        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {name}
        </p>
      </div>
    </div>
  );
};

export default ReviewsCarousel;