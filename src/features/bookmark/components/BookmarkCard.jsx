// src/features/bookmarks/components/BookmarkCard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBookmark, FaTrash, FaPen, FaTag } from 'react-icons/fa';

// One bookmark entry in the saved-profiles list.
// Props:
//   bookmark - { _id, tag, note, profile: { _id, fullName, profileImage,
//                skills, bio, location, workType, availability,
//                averageRating, isVerified, category } }
//   onEdit(bookmark)      - open tag/note editor
//   onRemove(profileId)   - remove from list
//   busy - disables actions while a mutation is in flight
const BookmarkCard = ({ bookmark, onEdit, onRemove, busy = false }) => {
  const navigate = useNavigate();
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  const { profile, tag, note } = bookmark;

  if (!profile) {
    // Profile was deleted/hidden after being bookmarked — still show
    // the bookmark shell so the user can clean it up.
    return (
      <div className="card" style={{ padding: '1.25rem', opacity: 0.6 }}>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          This profile is no longer available.
        </p>
        <button
          className="btn btn-text"
          style={{ marginTop: '0.5rem' }}
          onClick={() => onRemove?.(bookmark.profile)}
          disabled={busy}
        >
          <FaTrash size={12} /> Remove
        </button>
      </div>
    );
  }

  const {
    _id: profileId,
    fullName,
    profileImage,
    skills = [],
    bio,
    location,
    workType,
    availability,
    averageRating = 0,
    isVerified,
  } = profile;

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        gap: '1rem',
        padding: '1.25rem',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s, transform 0.2s',
      }}
      onClick={() => navigate(`/profile/${profileId}`)}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.18)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '';
        e.currentTarget.style.transform = '';
      }}
    >
      <img
        src={profileImage?.url || '/default-avatar.png'}
        alt={fullName}
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '1px solid var(--border-strong)',
          flexShrink: 0,
        }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {fullName}
          </h3>
          {isVerified && (
            <span className="badge badge-verified" style={{ fontSize: '0.6rem' }}>✓ Verified</span>
          )}
          {averageRating > 0 && (
            <span style={{ fontSize: '0.78rem', color: 'var(--warning)', fontWeight: 600 }}>
              ★ {averageRating.toFixed(1)}
            </span>
          )}
        </div>

        {bio && (
          <p style={{
            margin: '0.3rem 0 0',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {bio}
          </p>
        )}

        {skills.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
            {skills.slice(0, 4).map((s, i) => (
              <span key={i} className="skill-chip skill-chip--intermediate" style={{ fontSize: '0.68rem', padding: '0.2rem 0.6rem' }}>
                {s.name ?? s}
              </span>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          {location?.city && (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>📍 {location.city}</span>
          )}
          {workType && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>💼 {workType}</span>}
          {availability && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>🟢 {availability}</span>}
        </div>

        {(tag || note) && (
          <div style={{
            marginTop: '0.65rem',
            paddingTop: '0.65rem',
            borderTop: '1px dashed var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
          }}>
            {tag && (
              <span className="badge badge-accent" style={{ width: 'fit-content' }}>
                <FaTag size={9} /> {tag}
              </span>
            )}
            {note && (
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                “{note}”
              </p>
            )}
          </div>
        )}
      </div>

      {/* Actions — stopPropagation so they don't trigger card navigation */}
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flexShrink: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="btn-icon btn btn-ghost"
          title="Edit tag/note"
          onClick={() => onEdit?.(bookmark)}
          disabled={busy}
        >
          <FaPen size={12} />
        </button>

        {confirmingRemove ? (
          <button
            className="btn-icon btn btn-danger"
            title="Confirm remove"
            onClick={() => onRemove?.(profileId)}
            disabled={busy}
          >
            <FaTrash size={12} />
          </button>
        ) : (
          <button
            className="btn-icon btn btn-ghost"
            title="Remove bookmark"
            onClick={() => {
              setConfirmingRemove(true);
              setTimeout(() => setConfirmingRemove(false), 3000);
            }}
            disabled={busy}
          >
            <FaBookmark size={12} />
          </button>
        )}
      </div>
    </div>
  );
};

export default BookmarkCard;