// src/components/home/FeaturedProfessionals.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHomepageData } from '../../hooks/useHomepage';
import { ProfileCardCompact } from "../../features/profile/components/ProfileCardCompact";

// ─── Skeleton card shown while loading ───────────────────────────────────────
const SkeletonCard = () => (
  <div className="card animate-pulse">
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
  const [current, setCurrent] = useState(0);
  const { data, isLoading, isError } = useHomepageData();
  const navigate = useNavigate();

  const professionals = data?.featuredProfiles || [];
  const visible = 3;
  const maxStart = Math.max(0, professionals.length - visible);

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(maxStart, c + 1));

  const visibleProfs = professionals.slice(current, current + visible);
  const goToProfile = (id) => navigate(`/profile/${id}`);
  const goToHire = (id) => navigate(`/profile/${id}/hire`);

  return (
    <section className="py-16 sm:py-20" style={{ background: 'var(--bg-page)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--accent)' }}>
              Hand-Picked
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display" style={{ color: 'var(--text-primary)' }}>
              Featured Professionals
            </h2>
            <p className="mt-2 text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
              Verified experts with stellar track records.
            </p>
          </div>

          {/* Nav arrows — only show when there are enough cards to paginate */}
          {professionals.length > visible && (
            <div className="hidden sm:flex gap-2">
              <button
                onClick={prev}
                disabled={current === 0}
                className="w-10 h-10 rounded-full border flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={next}
                disabled={current >= maxStart}
                className="w-10 h-10 rounded-full border flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
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

        {/* Desktop: sliding window */}
        {!isLoading && !isError && professionals.length > 0 && (
          <>
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visibleProfs.map((pro) => (
                <ProfileCardCompact key={pro._id} profile={pro} onView={goToProfile} onHire={goToHire} />
              ))}
            </div>

            {/* Mobile: all stacked */}
            <div className="sm:hidden grid grid-cols-1 gap-4">
              {professionals.map((pro) => (
                <ProfileCardCompact key={pro._id} profile={pro} onView={goToProfile} onHire={goToHire} />
              ))}
            </div>
          </>
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
    </section>
  );
};

export default FeaturedProfessionals;