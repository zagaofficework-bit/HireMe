// src/features/search/components/SearchSuggestions.jsx

/**
 * SearchSuggestions
 * Dropdown rendered under SearchBar. Pure presentational — all
 * fetching/debouncing lives in SearchBar + useSearchSuggestions.
 */
const SearchSuggestions = ({ suggestions = [], loading, query, onSelect }) => {
  return (
    <div
      className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40
        rounded-xl border border-[var(--border)] bg-[var(--bg-panel)]
        shadow-xl shadow-black/10 overflow-hidden animate-fade-up"
    >
      {loading ? (
        <div className="px-4 py-3 text-sm text-[var(--text-muted)]">Searching skills…</div>
      ) : suggestions.length === 0 ? (
        <div className="px-4 py-3 text-sm text-[var(--text-muted)]">
          No matching skills for &ldquo;{query}&rdquo;
        </div>
      ) : (
        <ul className="max-h-64 overflow-y-auto scrollbar-thin">
          {suggestions.map(({ skill, count }) => (
            <li key={skill}>
              <button
                type="button"
                // Prevents the input's onBlur from firing before onClick registers
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onSelect(skill)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left
                  text-[var(--text-primary)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]
                  transition-colors"
              >
                <span>{skill}</span>
                <span className="text-xs text-[var(--text-muted)]">{count} profile{count === 1 ? '' : 's'}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchSuggestions;