// src/features/search/components/SearchBar.jsx
import { useState, useEffect, useRef } from 'react';
import { useSearchSuggestions } from '../../../hooks/useSearch';
import SearchSuggestions from './SearchSuggestions';

/**
 * SearchBar
 * Controlled-but-debounced search input with skill autocomplete.
 *
 * - Local `value` updates instantly (no input lag while typing).
 * - `onSearch(query)` fires 400ms after the user stops typing, or
 *   immediately on submit / suggestion click / clear — so the parent
 *   (SearchPage) only refetches once typing settles.
 */
const SearchBar = ({ initialValue = '', onSearch, placeholder = 'Search by name, skill, or role…' }) => {
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
  );
};

export default SearchBar;