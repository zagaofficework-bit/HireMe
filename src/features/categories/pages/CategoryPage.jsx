// src/features/search/pages/CategoryPage.jsx
import { useMemo, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useSearchProfiles } from '../../../hooks/useSearch';
import { useCategories } from '../../../hooks/useCategories';
import MainLayout from '../../../layouts/MainLayout';
import { getSkillIcon } from '../../../utils/skillsicons';
import { ProfileCardCompact } from "../../profile/components/ProfileCardCompact" // ← add — same card used on homepage (FeaturedProfessionals.jsx)

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

const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const categoryIndex = categories?.findIndex((c) => c.slug === slug) ?? -1;
  const category = categoryIndex >= 0 ? categories[categoryIndex] : null;
  const { accent, from, to } = ACCENTS[Math.max(categoryIndex, 0) % ACCENTS.length];

  const extraFilters = useMemo(() => {
    const obj = {};
    for (const [key, value] of searchParams.entries()) obj[key] = value;
    return obj;
  }, [searchParams]);

  const page = Number(extraFilters.page) || 1;
  const selectedSkill = extraFilters.skills || '';
  const viewAllRequested = extraFilters.view === 'all';

  // If a category has no skills configured, fall back straight to "view all"
  // so users never hit a dead-end subcategory grid with nothing in it.
  const hasSkills = !!category?.skills?.length;
  const viewAll = viewAllRequested || (!!category && !hasSkills);

  // Show the subcategory (skill) picker only when we haven't chosen a skill
  // or explicitly asked to browse everything in the category.
  const showSubcategories = !!category && !selectedSkill && !viewAll;
  const showProfiles = !!category && (!!selectedSkill || viewAll);

  // ✅ Pass category._id (ObjectId) — NOT the slug.
  // Search backend validates category as a 24-char hex string.
  // `view` is a frontend-only routing flag — strip it before it reaches the API.
  //
  // ⚠️ `skills` here is a SUBCATEGORY LABEL from categories.json (e.g. "Full
  // Stack Developer", "SEO Expert") — a role/title. It is NOT the same
  // vocabulary as a profile's `skills[].name` tags (e.g. "React.js",
  // "Node.js"), which are individual tech/tool tags a user picks freely.
  // An exact `skills.name` match between the two returns zero results even
  // for a perfect match (confirmed against real data: Rohan Deshmukh's bio
  // literally says "Full Stack Developer" but his skills array only has
  // React.js/Node.js/MongoDB/etc — never that exact phrase).
  //
  // FIX: send the subcategory label as `q` (full-text search) instead of
  // `skills` (exact tag match). The backend already text-indexes fullName,
  // bio, and skills.name and supports $text search via `q` — this lets a
  // subcategory click actually surface matching profiles by matching
  // against their bio/name too, not just an exact tag string.
  const filters = useMemo(() => {
    const { view, skills, ...rest } = extraFilters;
    return {
      ...rest,
      ...(category?._id ? { category: category._id } : {}),
      ...(skills ? { q: skills } : {}),
    };
  }, [extraFilters, category]);

  const { data, isLoading, isFetching, isError } = useSearchProfiles(filters, {
    enabled: showProfiles && !!category?._id, // wait for category + skill/view choice before querying
  });

  const updateFilters = useCallback((patch) => {
    const next = { ...extraFilters, ...patch };
    if (!('page' in patch)) next.page = '1';
    const cleaned = Object.fromEntries(
      Object.entries(next).filter(([, v]) => v !== '' && v !== false && v != null),
    );
    setSearchParams(cleaned);
  }, [extraFilters, setSearchParams]);

  const goToPage = (nextPage) => updateFilters({ page: String(nextPage) });
  const selectSkill = (skillName) => updateFilters({ skills: skillName, view: '' });
  const browseAllInCategory = () => updateFilters({ skills: '', view: 'all' });
  const backToSubcategories = () => updateFilters({ skills: '', view: '' });

  // Same handlers FeaturedProfessionals.jsx passes into ProfileCardCompact,
  // so "Hire Now" / "View Profile" behave identically on both pages.
  const goToProfile = (id) => navigate(`/profile/${id}`);
  const goToHire = (id) => navigate(`/profile/${id}/hire`);

  const profiles = data?.profiles || [];
  const pagination = data?.pagination;

  // Category list loaded but slug didn't match
  if (!categoriesLoading && categories && !category) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <div className="text-4xl mb-3">📂</div>
          <h1 className="font-display text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Category not found
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            This category doesn't exist or may have been removed.
          </p>
          <Link to="/" className="btn btn-primary">Back to home</Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* ── Banner ──────────────────────────────────────────────── */}
      <div
        className="border-b"
        style={{
          background: `linear-gradient(135deg, ${from}, ${to})`,
          borderColor: 'var(--border)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <button
            type="button"
            onClick={() => (showProfiles && hasSkills ? backToSubcategories() : navigate('/'))}
            className="text-xs font-semibold mb-4 inline-flex items-center gap-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            ← {showProfiles && hasSkills ? 'All subcategories' : 'Back to categories'}
          </button>

          <div className="flex items-start gap-4">
            {category ? (
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${from}, ${to})`,
                  border: `1px solid ${accent}40`,
                }}
              >
                {category.icon || '💼'}
              </div>
            ) : (
              <div className="w-14 h-14 rounded-2xl animate-pulse shrink-0" style={{ background: 'var(--bg-elevated)' }} />
            )}

            <div className="min-w-0">
              {category ? (
                <>
                  <h1 className="font-display text-2xl sm:text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
                    {category.name}
                    {selectedSkill && (
                      <span className="font-normal opacity-60"> → {selectedSkill}</span>
                    )}
                  </h1>
                  {category.description && !selectedSkill && (
                    <p className="text-sm sm:text-base mt-1 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                      {category.description}
                    </p>
                  )}
                  {showProfiles && (
                    <p className="text-xs font-semibold mt-3" style={{ color: accent }}>
                      {pagination?.total ?? category.profileCount ?? 0} expert{(pagination?.total ?? category.profileCount) === 1 ? '' : 's'} available
                    </p>
                  )}
                  {showSubcategories && (
                    <p className="text-xs font-semibold mt-3" style={{ color: accent }}>
                      Choose a subcategory to see matching experts
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className="h-7 w-48 rounded animate-pulse mb-2" style={{ background: 'var(--bg-elevated)' }} />
                  <div className="h-4 w-72 rounded animate-pulse" style={{ background: 'var(--bg-elevated)' }} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {categoriesLoading && (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading…</p>
        )}

        {/* ── Subcategory (skill) grid ─────────────────────────── */}
        {showSubcategories && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              {category.skills.map((skillName) => {
                const { icon: SkillIcon, color } = getSkillIcon(skillName);
                return (
                  <button
                    key={skillName}
                    type="button"
                    onClick={() => selectSkill(skillName)}
                    className="group h-32 sm:h-36 flex flex-col items-center justify-center gap-3 px-3 py-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                    style={{
                      borderColor: color + '25',
                      background: 'var(--bg-card)',
                    }}
                  >
                    <div
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                      style={{
                        background: `${color}18`,
                        border: `1px solid ${color}35`,
                      }}
                    >
                      <SkillIcon size={24} color={color} />
                    </div>
                    <p
                      className="text-sm font-semibold text-center leading-tight line-clamp-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {skillName}
                    </p>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={browseAllInCategory}
              className="btn btn-secondary text-xs"
            >
              Browse all experts in {category.name}
            </button>
          </>
        )}

        {/* ── Profile grid ───────────────────────────────────────── */}
        {showProfiles && isLoading && (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading profiles…</p>
        )}

        {showProfiles && isError && (
          <p className="text-sm" style={{ color: 'var(--danger)' }}>Something went wrong. Try again.</p>
        )}

        {showProfiles && !isLoading && !isError && profiles.length === 0 && (
          <div className="theme-card p-8 text-center">
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              No experts {selectedSkill ? `for "${selectedSkill}"` : 'in this category'} yet
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Check back soon, or browse a different subcategory.
            </p>
            {hasSkills && (
              <button type="button" onClick={backToSubcategories} className="btn btn-secondary mt-4 inline-flex">
                Back to subcategories
              </button>
            )}
          </div>
        )}

        {showProfiles && !isLoading && !isError && profiles.length > 0 && (
          <>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
              {pagination?.total ?? profiles.length} profile{pagination?.total === 1 ? '' : 's'} found
              {isFetching && <span className="ml-2" style={{ color: 'var(--accent)' }}>refreshing…</span>}
            </p>

            {/* Same card component as the homepage's Featured Professionals
               section — was inline custom markup before, which is why it
               looked different here. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {profiles.map((p) => (
                <ProfileCardCompact key={p._id} profile={p} onView={goToProfile} onHire={goToHire} />
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
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
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
      </div>
    </MainLayout>
  );
};

export default CategoryPage;