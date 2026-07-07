// src/features/search/components/SearchFilters.jsx
import { useState, useEffect } from 'react';
import { useCategories } from "../../../hooks/useCategories";

const WORK_TYPES = [
  { value: '', label: 'Any work type' },
  { value: 'remote', label: 'Remote' },
  { value: 'onsite', label: 'On-site' },
  { value: 'hybrid', label: 'Hybrid' },
];

const JOB_TYPES = [
  { value: '', label: 'Any job type' },
  { value: 'fulltime', label: 'Full-time' },
  { value: 'parttime', label: 'Part-time' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Internship' },
];

const AVAILABILITY_OPTIONS = [
  { value: '', label: 'Any availability' },
  { value: 'immediate', label: 'Immediate' },
  { value: 'one_week', label: 'Within 1 week' },
  { value: 'two_weeks', label: 'Within 2 weeks' },
  { value: 'one_month', label: 'Within 1 month' },
  { value: 'not_available', label: 'Not available' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'top_rated', label: 'Top rated' },
  { value: 'most_viewed', label: 'Most viewed' },
];

const EMPTY_FILTERS = {
  skills: '', category: '', city: '', state: '',
  workType: '', jobType: '', availability: '',
  minSalary: '', maxSalary: '', minRate: '', maxRate: '',
  verified: '', minRating: '', sortBy: 'newest',
};

/**
 * SearchFilters
 * Sidebar filter panel.
 *
 * Keeps a local "draft" for free-text/number fields so typing doesn't
 * refetch on every keystroke — those apply on submit. Dropdowns and the
 * verified checkbox apply instantly since there's no typing lag to
 * debounce.
 *
 * `filters` — current applied filters (object form of the URL params)
 * `onApply` — (nextFilters) => void
 */
const SearchFilters = ({ filters = {}, onApply }) => {
  const [draft, setDraft] = useState({ ...EMPTY_FILTERS, ...filters });
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  // Re-sync if filters change externally (e.g. browser back/forward)
  useEffect(() => setDraft({ ...EMPTY_FILTERS, ...filters }), [filters]);

  const set = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));

  const setAndApply = (key, value) => {
    const next = { ...draft, [key]: value };
    setDraft(next);
    onApply?.(next);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply?.(draft);
  };

  const handleClear = () => {
    setDraft(EMPTY_FILTERS);
    onApply?.(EMPTY_FILTERS);
  };

  const isVerified = draft.verified === true || draft.verified === 'true';

  return (
    <form onSubmit={handleSubmit} className="theme-panel rounded-2xl p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-[var(--text-primary)]">Filters</h3>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Skills */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Skills</label>
        <input
          type="text"
          value={draft.skills}
          onChange={(e) => set('skills', e.target.value)}
          placeholder="React, Node.js"
          className="theme-input w-full px-3 py-2 rounded-lg text-sm"
        />
        <p className="text-[11px] text-[var(--text-muted)]">Comma-separated, matches any</p>
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Category</label>
        <select
          value={draft.category}
          onChange={(e) => setAndApply('category', e.target.value)}
          disabled={categoriesLoading}
          className="theme-input w-full px-3 py-2 rounded-lg text-sm"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">City</label>
          <input
            type="text"
            value={draft.city}
            onChange={(e) => set('city', e.target.value)}
            placeholder="Mumbai"
            className="theme-input w-full px-3 py-2 rounded-lg text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">State</label>
          <input
            type="text"
            value={draft.state}
            onChange={(e) => set('state', e.target.value)}
            placeholder="Maharashtra"
            className="theme-input w-full px-3 py-2 rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Work type */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Work type</label>
        <select
          value={draft.workType}
          onChange={(e) => setAndApply('workType', e.target.value)}
          className="theme-input w-full px-3 py-2 rounded-lg text-sm"
        >
          {WORK_TYPES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Job type */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Job type</label>
        <select
          value={draft.jobType}
          onChange={(e) => setAndApply('jobType', e.target.value)}
          className="theme-input w-full px-3 py-2 rounded-lg text-sm"
        >
          {JOB_TYPES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Availability */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Availability</label>
        <select
          value={draft.availability}
          onChange={(e) => setAndApply('availability', e.target.value)}
          className="theme-input w-full px-3 py-2 rounded-lg text-sm"
        >
          {AVAILABILITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Salary range */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Expected salary (₹/mo)</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number" min="0" value={draft.minSalary}
            onChange={(e) => set('minSalary', e.target.value)}
            placeholder="Min" className="theme-input w-full px-3 py-2 rounded-lg text-sm"
          />
          <input
            type="number" min="0" value={draft.maxSalary}
            onChange={(e) => set('maxSalary', e.target.value)}
            placeholder="Max" className="theme-input w-full px-3 py-2 rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Hourly rate range */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Hourly rate (₹)</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number" min="0" value={draft.minRate}
            onChange={(e) => set('minRate', e.target.value)}
            placeholder="Min" className="theme-input w-full px-3 py-2 rounded-lg text-sm"
          />
          <input
            type="number" min="0" value={draft.maxRate}
            onChange={(e) => set('maxRate', e.target.value)}
            placeholder="Max" className="theme-input w-full px-3 py-2 rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Minimum rating */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Minimum rating</label>
        <select
          value={draft.minRating}
          onChange={(e) => setAndApply('minRating', e.target.value)}
          className="theme-input w-full px-3 py-2 rounded-lg text-sm"
        >
          <option value="">Any rating</option>
          {[4, 3, 2, 1].map((r) => <option key={r} value={r}>{r}+ stars</option>)}
        </select>
      </div>

      {/* Verified only */}
      <label className="flex items-center gap-2 text-sm text-[var(--text-primary)] cursor-pointer">
        <input
          type="checkbox"
          checked={isVerified}
          onChange={(e) => setAndApply('verified', e.target.checked ? 'true' : '')}
          className="w-4 h-4 rounded accent-[var(--accent)]"
        />
        Verified profiles only
      </label>

      {/* Sort by */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Sort by</label>
        <select
          value={draft.sortBy}
          onChange={(e) => setAndApply('sortBy', e.target.value)}
          className="theme-input w-full px-3 py-2 rounded-lg text-sm"
        >
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <button type="submit" className="btn btn-primary w-full">Apply Filters</button>
    </form>
  );
};

export default SearchFilters;