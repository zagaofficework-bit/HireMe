// src/features/bookmarks/components/BookmarkButton.jsx
import { useEffect, useState } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useBookmarkStatus } from '../../../hooks/useBookmarks';

// Drop this on any profile card. It checks status on mount (cheap —
// result is cached in the slice's statusByProfile map per profileId)
// and toggles add/remove on click.
//
// Props:
//   profileId   - required, the Profile _id to bookmark
//   variant     - 'icon' (default, round icon-only button) | 'pill' (icon + label)
//   onChange    - optional (bookmarked: boolean) => void, e.g. for a toast
const BookmarkButton = ({ profileId, variant = 'icon', onChange }) => {
  const { bookmarked, mutating, check, toggle } = useBookmarkStatus(profileId);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (profileId && !checked) {
      check();
      setChecked(true);
    }
  }, [profileId, checked, check]);

  const handleClick = async (e) => {
    e.stopPropagation(); // don't trigger card navigation
    const result = await toggle();
    if (!result?.error && onChange) onChange(!bookmarked);
  };

  if (variant === 'pill') {
    return (
      <button
        type="button"
        className={`btn btn-icon ${bookmarked ? 'btn-secondary' : 'btn-outline'}`}
        onClick={handleClick}
        disabled={mutating}
        title={bookmarked ? 'Remove bookmark' : 'Bookmark this profile'}
        style={{ gap: '0.4rem' }}
      >
        {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
        {bookmarked ? 'Saved' : 'Save'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={mutating}
      title={bookmarked ? 'Remove bookmark' : 'Bookmark this profile'}
      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this profile'}
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--border-strong)',
        background: bookmarked ? 'var(--accent-soft)' : 'var(--bg-elevated)',
        color: bookmarked ? 'var(--accent)' : 'var(--text-secondary)',
        cursor: mutating ? 'not-allowed' : 'pointer',
        opacity: mutating ? 0.6 : 1,
        flexShrink: 0,
        transition: 'background-color 0.15s ease, color 0.15s ease, transform 0.15s ease',
      }}
      onMouseEnter={(e) => { if (!mutating) e.currentTarget.style.transform = 'scale(1.06)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {bookmarked ? <FaBookmark size={15} /> : <FaRegBookmark size={15} />}
    </button>
  );
};

export default BookmarkButton;