// src/features/search/components/SearchBar.jsx
import { useState, useEffect, useRef } from 'react';
import { useSearchSuggestions } from '../../../hooks/useSearch';
import SearchSuggestions from './SearchSuggestions';

const AVAILABILITY_OPTIONS = [
  { value: 'available', label: 'Available' },
  { value: 'busy', label: 'Busy' },
  { value: 'not_available', label: 'Not Available' },
];

/**
 * SearchBar
 * Controlled-but-debounced search input with skill autocomplete.
 *
 * - Local `value` updates instantly (no input lag while typing).
 * - `onSearch(query)` fires 400ms after the user stops typing, or
 *   immediately on submit / suggestion click / clear — so the parent
 *   (SearchPage) only refetches once typing settles.
 *
 * Mobile/tablet only (hidden on desktop, lg+): a secondary toolbar below
 * the input with a "Filters" pill (shows active filter count as a badge)
 * and an availability dropdown (Available / Busy / Not Available).
 */
const SearchBar = ({
  initialValue = '',
  onSearch,
  placeholder = 'Search by name, skill, or role…',
  activeFilterCount = 0,
  onFilterClick,
  availability = '',
  onAvailabilityChange,
}) => {
  const [value, setValue] = useState(initialValue);
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef(null);

  // Keep input in sync if parent resets it externally (e.g. "Clear filters")
  useEffect(() => setValue(initialValue), [initialValue]);

  const { data: suggestions = [], isFetching } = useSearchSuggestions(value.trim());

  const fireSearchNow = (q) => {
    clearTimeout(debounceRef.current);
    onSearch?.(q);
  };

  const handleChange = (e) => {
    const next = e.target.value;
    setValue(next);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearch?.(next), 400);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fireSearchNow(value);
    setFocused(false);
  };

  const handleSelectSuggestion = (skill) => {
    setValue(skill);
    fireSearchNow(skill);
    setFocused(false);
  };

  const handleClear = () => {
    setValue('');
    fireSearchNow('');
  };

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const showDropdown = focused && value.trim().length >= 2;

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative w-full">
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-xl
            border border-[var(--border)] bg-[var(--bg-input)]
            focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_3px_var(--accent-soft)]
            transition-all duration-200"
        >
          <svg className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          <input
            type="text"
            value={value}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 120)} // allow suggestion click to register
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none"
          />

          {value && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          <button type="submit" className="btn btn-primary py-2 px-4 text-xs flex-shrink-0">
            Search
          </button>
        </div>

        {showDropdown && (
          <SearchSuggestions
            suggestions={suggestions}
            loading={isFetching}
            query={value}
            onSelect={handleSelectSuggestion}
          />
        )}
      </form>

      {/* ── Mobile/tablet-only toolbar: Filters + Availability ─────────────
          Hidden on desktop (lg+) — desktop keeps its own existing controls. */}
      <div className="lg:hidden flex items-center gap-3 mt-3">
        <button
          type="button"
          onClick={onFilterClick}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full
            border border-[var(--border)] bg-[var(--bg-input)]
            text-sm font-semibold text-[var(--text-primary)]
            hover:border-[var(--accent)]/40 transition-colors duration-200"
        >
          <svg className="w-4 h-4 text-[var(--accent)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 8h12M9 12h6M11 16h2" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--accent)] text-white text-[11px] font-bold flex-shrink-0">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="relative flex-1 max-w-[190px]">
          <select
            value={availability}
            onChange={(e) => onAvailabilityChange?.(e.target.value)}
            className="w-full appearance-none px-4 py-2.5 pr-9 rounded-full
              border border-[var(--border)] bg-[var(--bg-input)]
              text-sm font-semibold text-[var(--text-primary)]
              hover:border-[var(--accent)]/40 transition-colors duration-200
              outline-none focus:border-[var(--accent)]"
          >
            <option value="">All Availability</option>
            {AVAILABILITY_OPTIONS.map(({ value: v, label }) => (
              <option key={v} value={v}>{label}</option>
            ))}
          </select>
          <svg
            className="w-4 h-4 text-[var(--text-muted)] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;