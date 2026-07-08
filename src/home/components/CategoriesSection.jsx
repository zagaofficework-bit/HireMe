// src/home/components/CategoriesSection.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from "../../hooks/useCategories";

const ACCENTS = [
  { accent: '#29c8d6', from: 'rgba(41,200,214,0.15)',  to: 'rgba(16,80,86,0.15)'   },
  { accent: '#a855f7', from: 'rgba(168,85,247,0.12)',  to: 'rgba(236,72,153,0.08)' },
  { accent: '#f97316', from: 'rgba(249,115,22,0.12)',  to: 'rgba(245,158,11,0.08)' },
  { accent: '#22c55e', from: 'rgba(34,197,94,0.12)',   to: 'rgba(16,185,129,0.08)' },
  { accent: '#f43f5e', from: 'rgba(244,63,94,0.12)',   to: 'rgba(239,68,68,0.08)'  },
  { accent: '#0ea5e9', from: 'rgba(14,165,233,0.12)',  to: 'rgba(59,130,246,0.08)' },
  { accent: '#eab308', from: 'rgba(234,179,8,0.12)',   to: 'rgba(249,115,22,0.08)' },
  { accent: '#8b5cf6', from: 'rgba(139,92,246,0.12)',  to: 'rgba(109,40,217,0.08)' },
];

const INITIAL_VISIBLE = 6;

// idx 0-1 → visible on every screen (mobile: 1 col = 2 stacked)
// idx 2-3 → hidden on mobile, visible sm+ (tablet: 2 col = 4 total)
// idx 4-5 → hidden below lg, visible lg+ (desktop: 3 col = 6 total)
const visibilityForIndex = (idx) => {
  if (idx < 2) return '';
  if (idx < 4) return 'hidden sm:block';
  return 'hidden lg:block';
};

const SkeletonCard = ({ idx = 0 }) => (
  <div
    className={`rounded-2xl border p-5 animate-pulse ${visibilityForIndex(idx)}`}
    style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
  >
    <div className="w-11 h-11 rounded-xl mb-4" style={{ background: 'var(--bg-elevated)' }} />
    <div className="h-4 w-2/3 rounded mb-2" style={{ background: 'var(--bg-elevated)' }} />
    <div className="h-3 w-1/2 rounded mb-4" style={{ background: 'var(--bg-elevated)' }} />
    <div className="flex gap-1.5">
      {[40, 52, 36].map((w) => (
        <div key={w} className="h-5 rounded-md" style={{ width: w, background: 'var(--bg-elevated)' }} />
      ))}
    </div>
  </div>
);

const ErrorState = ({ onRetry }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-16 gap-4">
    <div className="text-4xl">⚠️</div>
    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
      Failed to load categories.
    </p>
    <button onClick={onRetry} className="btn btn-secondary text-xs px-4 py-2">
      Retry
    </button>
  </div>
);

const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-16 gap-3">
    <div className="text-4xl">📂</div>
    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
      No categories available yet.
    </p>
  </div>
);

const CategoriesSection = () => {
  const navigate = useNavigate();
  const { data: categories, isLoading, isError, refetch } = useCategories();

  // hoveredSlug only drives the visual hover-active styling now —
  // click navigates to /category/:slug instead of toggling local state.
  const [hoveredSlug, setHoveredSlug] = useState(null);

  // "View all" now navigates to a dedicated /categories page instead of
  // expanding this grid in place — the homepage section always stays
  // capped at INITIAL_VISIBLE, no local showAll toggle needed anymore.
  const goToAllCategories = () => navigate('/categories');

  const visibleCategories = !isLoading && !isError && categories?.length
    ? categories.slice(0, INITIAL_VISIBLE)
    : [];

  // Always offer a way to reach the full list — the responsive
  // per-breakpoint hiding below means mobile only ever shows 2,
  // so "view all" is useful even when total count is small.
  const showViewAll = (categories?.length || 0) > 2;

  return (
    <section
      className="py-16 sm:py-20 transition-colors duration-300"
      style={{ background: 'var(--bg-page)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-end justify-between mb-10">
          <div>
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-2"
              style={{ color: 'var(--accent)' }}
            >
              What We Offer
            </p>
            <h2
              className="text-3xl sm:text-4xl font-extrabold leading-tight font-display"
              style={{ color: 'var(--text-primary)' }}
            >
              Explore Expertise
            </h2>
            <p
              className="mt-2 text-sm sm:text-base"
              style={{ color: 'var(--text-secondary)' }}
            >
              Top-rated categories curated for your business needs.
            </p>
          </div>

          {showViewAll && (
            <button
              onClick={goToAllCategories}
              className="hidden lg:flex items-center gap-1.5 text-sm font-semibold transition-colors group flex-shrink-0"
              style={{ color: 'var(--accent)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--accent)')}
            >
              View all
              <span className="group-hover:translate-x-0.5 transition-transform inline-block">
                →
              </span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading && Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} idx={i} />
          ))}

          {isError && <ErrorState onRetry={refetch} />}

          {!isLoading && !isError && !categories?.length && <EmptyState />}

          {visibleCategories.map((cat, idx) => {
            const { accent, from, to } = ACCENTS[idx % ACCENTS.length];
            const isHovered = hoveredSlug === cat.slug;

            const inactiveFrom = from.replace(/[\d.]+\)$/, '0.05)');
            const inactiveTo   = to.replace(/[\d.]+\)$/, '0.03)');

            return (
              <button
                key={cat._id}
                onClick={() => navigate(`/category/${cat.slug}`)}
                onMouseEnter={() => setHoveredSlug(cat.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
                className={`group text-left p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${visibilityForIndex(idx)}`}
                style={{
                  border: '1px solid ' + (isHovered ? accent + '50' : accent + '25'),
                  background: isHovered
                    ? 'linear-gradient(135deg, ' + from + ', ' + to + ')'
                    : 'linear-gradient(135deg, ' + inactiveFrom + ', ' + inactiveTo + ')',
                  boxShadow: isHovered ? '0 8px 32px -8px ' + accent + '25' : undefined,
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-xl transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, ' + from + ', ' + to + ')',
                    border: '1px solid ' + accent + '30',
                  }}
                >
                  {cat.icon || '💼'}
                </div>

                <h3
                  className="text-base font-bold mb-0.5 font-display"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {cat.name}
                </h3>

                <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                  {cat.profileCount > 0
                    ? cat.profileCount.toLocaleString() + '+ active experts'
                    : cat.description || 'Explore experts'}
                </p>

                {cat.description && (
                  <div className="flex flex-wrap gap-1.5 mb-1">
                    {cat.description
                      .split(/[,·•|]/)
                      .slice(0, 4)
                      .map((tag) => tag.trim())
                      .filter(Boolean)
                      .map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium"
                          style={{
                            background: 'var(--bg-elevated)',
                            color: 'var(--text-secondary)',
                            border: '1px solid ' + accent + '20',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                )}

                <div
                  className="flex items-center gap-1 mt-4 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ color: accent }}
                >
                  Browse experts →
                </div>
              </button>
            );
          })}
        </div>

        {/* Mobile & tablet: bottom "view all" link (desktop uses the top-right one) */}
        {showViewAll && (
          <div className="mt-6 lg:hidden text-center">
            <button
              onClick={goToAllCategories}
              className="text-sm font-semibold"
              style={{ color: 'var(--accent)' }}
            >
              View all categories →
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default CategoriesSection;