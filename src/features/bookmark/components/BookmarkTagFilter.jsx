// src/features/bookmarks/components/BookmarkTagFilter.jsx
import { useEffect } from 'react';
import { useBookmarks } from '../../../hooks/useBookmarks';

// Pill row of tags the client has used to organize bookmarks.
// "All" is always first and clears the active filter.
const BookmarkTagFilter = ({ activeTag, onSelect }) => {
  const { tags, tagsLoading, loadTags } = useBookmarks();

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  if (!tagsLoading && tags.length === 0) return null;

  return (
    <div
      className="scrollbar-thin"
      style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.25rem',
      }}
    >
      <button
        className={`badge ${!activeTag ? 'badge-accent' : 'badge-info'}`}
        style={{
          border: 'none',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          padding: '0.4rem 0.85rem',
          opacity: !activeTag ? 1 : 0.7,
        }}
        onClick={() => onSelect(null)}
      >
        All
      </button>

      {tagsLoading
        ? Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              style={{
                width: 70,
                height: 24,
                borderRadius: 9999,
                background: 'var(--bg-elevated)',
              }}
            />
          ))
        : tags.map((tag) => (
            <button
              key={tag}
              className={`badge ${activeTag === tag ? 'badge-accent' : 'badge-info'}`}
              style={{
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                padding: '0.4rem 0.85rem',
                opacity: activeTag === tag ? 1 : 0.7,
              }}
              onClick={() => onSelect(tag)}
            >
              {tag}
            </button>
          ))}
    </div>
  );
};

export default BookmarkTagFilter;