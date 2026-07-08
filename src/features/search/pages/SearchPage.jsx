// src/features/search/pages/SearchPage.jsx
import { useMemo, useCallback, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import SearchFilters from '../components/SearchFilters';
import { useSearchProfiles } from '../../../hooks/useSearch';
import { ProfileCardCompact } from '../../profile/components/ProfileCardCompact';
import MainLayout from '../../../layouts/MainLayout';

// Keys that don't count as "filters" for the mobile Filters badge
const NON_FILTER_KEYS = new Set(['q', 'page']);

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filters = useMemo(() => {
    const obj = {};
    for (const [key, value] of searchParams.entries()) obj[key] = value;
    return obj;
  }, [searchParams]);

  const page = Number(filters.page) || 1;

  const activeFilterCount = useMemo(
    () => Object.keys(filters).filter((k) => !NON_FILTER_KEYS.has(k)).length,
    [filters],
  );

  const { data, isLoading, isFetching, isError } = useSearchProfiles(filters);

  const updateFilters = useCallback((patch) => {
    const next = { ...filters, ...patch };
    if (!('page' in patch)) next.page = '1';

    const cleaned = Object.fromEntries(
      Object.entries(next).filter(([, v]) => v !== '' && v !== false && v != null),
    );
    setSearchParams(cleaned);
  }, [filters, setSearchParams]);

  const goToPage = (nextPage) => updateFilters({ page: String(nextPage) });
  const goToProfile = (id) => navigate(`/profile/${id}`);
  const goToHire = (id) => navigate(`/profile/${id}/hire`);

  const profiles = data?.profiles || [];
  const pagination = data?.pagination;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 space-y-1">
          <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">Find talent</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Search by skill, role, or location across all verified freelancers.
          </p>
        </div>

        <div className="mb-6">
          <SearchBar
            initialValue={filters.q || ''}
            onSearch={(q) => updateFilters({ q })}
            activeFilterCount={activeFilterCount}
            onFilterClick={() => setMobileFiltersOpen(true)}
            availability={filters.availability || ''}
            onAvailabilityChange={(availability) => updateFilters({ availability })}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Desktop filters sidebar — unchanged, just now explicitly desktop-only since
              the mobile "Filters" pill in SearchBar opens the drawer below instead */}
          <aside className="hidden lg:block lg:sticky lg:top-20 self-start">
            <SearchFilters filters={filters} onApply={updateFilters} />
          </aside>

          <main>
            {isLoading ? (
              <p className="text-sm text-[var(--text-muted)]">Loading profiles…</p>
            ) : isError ? (
              <p className="text-sm text-[var(--danger)]">Something went wrong. Try again.</p>
            ) : profiles.length === 0 ? (
              <div className="theme-card p-8 text-center">
                <p className="font-semibold text-[var(--text-primary)]">No profiles match these filters</p>
                <p className="text-sm text-[var(--text-muted)] mt-1">Try widening your search or clearing a filter.</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-[var(--text-muted)] mb-4">
                  {pagination?.total ?? profiles.length} profile{pagination?.total === 1 ? '' : 's'} found
                  {isFetching && <span className="ml-2 text-[var(--accent)]">refreshing…</span>}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {profiles.map((p) => (
                    <ProfileCardCompact
                      key={p._id}
                      profile={p}
                      onView={goToProfile}
                      onHire={goToHire}
                    />
                  ))}
                </div>

                {pagination && pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => goToPage(page - 1)}
                      className="btn btn-secondary py-2 px-3 text-xs"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-[var(--text-muted)]">
                      Page {page} of {pagination.pages}
                    </span>
                    <button
                      type="button"
                      disabled={page >= pagination.pages}
                      onClick={() => goToPage(page + 1)}
                      className="btn btn-secondary py-2 px-3 text-xs"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* ══════════════════ Mobile/tablet filters drawer ══════════════════
          Opened by the "Filters" pill inside SearchBar (lg:hidden there too) */}
      <div
        className={`lg:hidden fixed inset-0 z-[90] bg-black/60 transition-opacity duration-300
          ${mobileFiltersOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileFiltersOpen(false)}
      />

      <aside
        className={`lg:hidden fixed top-0 right-0 z-[100] h-screen w-[88%] max-w-sm
          bg-[var(--bg-panel)] shadow-2xl flex flex-col overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${mobileFiltersOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-[var(--accent)]/10 flex-shrink-0">
          <h2 className="text-sm font-bold text-[var(--text-primary)]">Filters</h2>
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(false)}
            className="p-2 text-[var(--text-secondary)]"
            aria-label="Close filters"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5">
          <SearchFilters
            filters={filters}
            onApply={(patch) => {
              updateFilters(patch);
              setMobileFiltersOpen(false);
            }}
          />
        </div>
      </aside>
    </MainLayout>
  );
};

export default SearchPage;