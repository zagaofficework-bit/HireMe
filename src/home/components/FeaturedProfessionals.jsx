// src/components/home/FeaturedProfessionals.jsx
import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHomepageData } from '../../hooks/useHomepage';
import { ProfileCardCompact } from "../../features/profile/components/ProfileCardCompact";

// ─── Skeleton card shown while loading ───────────────────────────────────────
const SkeletonCard = () => (
  <div className="card animate-pulse flex-none w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]">
    <div className="flex items-start gap-3">
      <div className="w-16 h-16 rounded-xl flex-shrink-0" style={{ background: 'var(--bg-elevated)' }} />
      <div className="flex-1 space-y-2">
        <div className="h-4 rounded w-3/4" style={{ background: 'var(--bg-elevated)' }} />
        <div className="h-3 rounded w-1/2" style={{ background: 'var(--bg-elevated)' }} />
        <div className="h-3 rounded w-1/3" style={{ background: 'var(--bg-elevated)' }} />
      </div>
    </div>
    <div className="h-3 rounded w-full mt-4" style={{ background: 'var(--bg-elevated)' }} />
    <div className="h-3 rounded w-5/6 mt-2" style={{ background: 'var(--bg-elevated)' }} />
    <div className="flex gap-2 mt-4">
      <div className="h-5 w-14 rounded-md" style={{ background: 'var(--bg-elevated)' }} />
      <div className="h-5 w-14 rounded-md" style={{ background: 'var(--bg-elevated)' }} />
    </div>
    <div className="h-9 rounded-xl mt-4" style={{ background: 'var(--bg-elevated)' }} />
  </div>
);

// ─── Main section ─────────────────────────────────────────────────────────────
const FeaturedProfessionals = () => {
  const { data, isLoading, isError } = useHomepageData();
  const navigate = useNavigate();

  const professionals = data?.featuredProfiles || [];

  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= maxScroll - 4);
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener('resize', updateEdges);
    return () => window.removeEventListener('resize', updateEdges);
  }, [updateEdges, professionals.length]);

  const scrollByPage = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' });
  };

  const goToProfile = (id) => navigate(`/profile/${id}`);
  const goToHire = (id) => navigate(`/profile/${id}/hire`);

  const showArrows = professionals.length > 1;

  return (
    <section className="py-16 sm:py-20" style={{ background: 'var(--bg-page)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-8 sm:mb-10 gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--accent)' }}>
              Hand-Picked
            </p>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display" style={{ color: 'var(--text-primary)' }}>
              Featured Professionals
            </h2>
            <p className="mt-2 text-xs sm:text-base" style={{ color: 'var(--text-secondary)' }}>
              Verified experts with stellar track records.
            </p>
          </div>

          {/* Nav arrows — visible on every screen size now */}
          {showArrows && !isLoading && !isError && (
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => scrollByPage(-1)}
                disabled={atStart}
                aria-label="Previous"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scrollByPage(1)}
                disabled={atEnd}
                aria-label="Next"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="flex gap-4 sm:gap-5 overflow-hidden">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>
            Couldn't load featured professionals right now.
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && professionals.length === 0 && (
          <div className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>
            No featured professionals yet.
          </div>
        )}

        {/* Carousel: 1-up mobile, 2-up tablet, 3-up desktop — swipe or arrows */}
        {!isLoading && !isError && professionals.length > 0 && (
          <div
            ref={trackRef}
            onScroll={updateEdges}
            className="featured-track flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2"
          >
            {professionals.map((pro) => (
              <div
                key={pro._id}
                className="flex-none w-[92%] xs:w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] snap-start"
              >
                <ProfileCardCompact profile={pro} onView={goToProfile} onHire={goToHire} />
              </div>
            ))}
          </div>
        )}

        {/* Browse All */}
        {!isLoading && professionals.length > 0 && (
          <div className="mt-10 text-center">
            <button onClick={() => navigate('/search')} className="btn btn-secondary">
              Browse All Experts
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        )}

      </div>

      <style>{`
        .featured-track {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .featured-track::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default FeaturedProfessionals;