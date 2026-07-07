// src/features/categories/pages/AllCategoriesPage.jsx
//
// Route: /categories
// Reached via CategoriesSection.jsx's "View all" button on the homepage.
// Clicking any category tile here navigates to /category/:slug (CategoryPage),
// which shows that category's subcategory grid — same behavior as clicking
// a tile directly from the homepage section.
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../../../hooks/useCategories';
import MainLayout from '../../../layouts/MainLayout';

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

const SkeletonCard = () => (
  <div
    className="rounded-2xl border p-5 animate-pulse"
    style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
  >
    <div className="w-11 h-11 rounded-xl mb-4" style={{ background: 'var(--bg-elevated)' }} />
    <div className="h-4 w-2/3 rounded mb-2" style={{ background: 'var(--bg-elevated)' }} />
    <div className="h-3 w-1/2 rounded" style={{ background: 'var(--bg-elevated)' }} />
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

const EmptyState = ({ hasQuery }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-16 gap-3">
    <div className="text-4xl">📂</div>
    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
      {hasQuery ? 'No categories match your search.' : 'No categories available yet.'}
    </p>
  </div>
);

const AllCategoriesPage = () => {
  const navigate = useNavigate();
  const { data: categories, isLoading, isError, refetch } = useCategories();
  const [query, setQuery] = useState('');

  const filteredCategories = useMemo(() => {
    if (!categories?.length) return [];
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name?.toLowerCase().includes(q));
  }, [categories, query]);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

        <div className="mb-8">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-2"
            style={{ color: 'var(--accent)' }}
          >
            What We Offer
          </p>
          <h1
            className="text-3xl sm:text-4xl font-extrabold leading-tight font-display"
            style={{ color: 'var(--text-primary)' }}
          >
            All Categories
          </h1>
          <p className="mt-2 text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
            Browse every category, then pick a subcategory to see matching experts.
          </p>
        </div>

        <div className="mb-8 max-w-sm">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search categories..."
            className="input-field w-full"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading && Array.from({ length: 9 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}

          {isError && <ErrorState onRetry={refetch} />}

          {!isLoading && !isError && filteredCategories.length === 0 && (
            <EmptyState hasQuery={!!query.trim()} />
          )}

          {!isLoading && !isError && filteredCategories.map((cat, idx) => {
            const { accent, from, to } = ACCENTS[idx % ACCENTS.length];

            return (
              <button
                key={cat._id}
                onClick={() => navigate(`/category/${cat.slug}`)}
                className="group text-left p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{
                  borderColor: accent + '25',
                  background: 'linear-gradient(135deg, ' + from.replace(/[\d.]+\)$/, '0.05)') + ', ' + to.replace(/[\d.]+\)$/, '0.03)') + ')',
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

                <div
                  className="flex items-center gap-1 mt-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ color: accent }}
                >
                  Browse experts →
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};

export default AllCategoriesPage;