// src/features/bookmarks/pages/BookmarksPage.jsx
import { useEffect, useState } from 'react';
import { FaBookmark } from 'react-icons/fa';
import MainLayout from '../../../layouts/MainLayout';
import { useBookmarks } from '../../../hooks/useBookmarks';
import BookmarkCard from '../components/BookmarkCard';
import BookmarkTagFilter from '../components/BookmarkTagFilter';

const PAGE_LIMIT = 20;

const BookmarksPage = () => {
  const {
    items,
    pagination,
    loading,
    mutating,
    error,
    loadBookmarks,
    editBookmark,
    removeFromBookmarks,
    clearError,
  } = useBookmarks();

  const [activeTag, setActiveTag] = useState(null);
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null); // bookmark being edited
  const [draft, setDraft] = useState({ tag: '', note: '' });

  useEffect(() => {
    loadBookmarks({ tag: activeTag || undefined, page, limit: PAGE_LIMIT });
  }, [loadBookmarks, activeTag, page]);

  const handleSelectTag = (tag) => {
    setActiveTag(tag);
    setPage(1);
  };

  const openEdit = (bookmark) => {
    setEditing(bookmark);
    setDraft({ tag: bookmark.tag || '', note: bookmark.note || '' });
  };

  const closeEdit = () => setEditing(null);

  const saveEdit = async () => {
    if (!editing) return;
    await editBookmark({
      bookmarkId: editing._id,
      tag: draft.tag || null,
      note: draft.note || null,
    });
    closeEdit();
    // refresh tags in case a new one was added
    loadBookmarks({ tag: activeTag || undefined, page, limit: PAGE_LIMIT });
  };

  const handleRemove = (profileId) => {
    removeFromBookmarks(profileId);
  };

  return (
    <MainLayout>
      <div className="profile-page" style={{ maxWidth: 760 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
            Saved Profiles
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0.35rem 0 0' }}>
            Profiles you've bookmarked for later — organize them with tags and notes.
          </p>
        </div>

        <BookmarkTagFilter activeTag={activeTag} onSelect={handleSelectTag} />

        {error && (
          <div
            className="card"
            style={{ borderColor: 'var(--danger)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</span>
            <button className="btn-text btn" onClick={clearError}>Dismiss</button>
          </div>
        )}

        {loading ? (
          <div className="page-loading">Loading your saved profiles…</div>
        ) : items.length === 0 ? (
          <div className="empty-state-page">
            <FaBookmark size={32} color="var(--text-muted)" />
            <h2>No saved profiles yet</h2>
            <p>
              {activeTag
                ? `You don't have any bookmarks tagged "${activeTag}".`
                : 'Bookmark profiles while browsing to find them here later.'}
            </p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {items.map((bookmark) => (
                <BookmarkCard
                  key={bookmark._id}
                  bookmark={bookmark}
                  onEdit={openEdit}
                  onRemove={handleRemove}
                  busy={mutating}
                />
              ))}
            </div>

            {pagination.pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  className="btn btn-secondary"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </button>
                <span style={{ alignSelf: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  className="btn btn-secondary"
                  disabled={page >= pagination.pages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Edit tag/note modal ───────────────────────────────────────── */}
      {editing && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(8, 21, 20, 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '1rem',
          }}
          onClick={closeEdit}
        >
          <div
            className="card"
            style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
              Edit "{editing.profile?.fullName || 'Bookmark'}"
            </h3>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Tag</label>
              <input
                className="input-field"
                placeholder="e.g. React Developers"
                value={draft.tag}
                maxLength={50}
                onChange={(e) => setDraft((d) => ({ ...d, tag: e.target.value }))}
                style={{ marginTop: '0.35rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Note</label>
              <textarea
                className="input-field"
                placeholder="Private note about this profile…"
                value={draft.note}
                maxLength={500}
                onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value }))}
                style={{ marginTop: '0.35rem' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
              <button className="btn btn-ghost" onClick={closeEdit} disabled={mutating}>Cancel</button>
              <button className="btn btn-primary" onClick={saveEdit} disabled={mutating}>
                {mutating ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default BookmarksPage;