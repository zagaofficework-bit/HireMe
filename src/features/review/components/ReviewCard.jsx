// src/features/reviews/components/ReviewCard.jsx
// Single review tile. Used both on a profile's public review list
// (read-only) and on MyReviewsPage (with edit/delete actions for the
// owning client). Pass `onEdit` / `onDelete` to enable those actions.
import StarRating from './StarRating';

const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('') || '?';

const formatDate = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const ReviewCard = ({ review, onEdit, onDelete, deleting = false }) => {
  if (!review) return null;

  // On the profile page, `reviewer` is populated. On MyReviewsPage,
  // `reviewee`/`profile` are populated instead — handle both shapes.
  const personName = review.reviewer?.name || review.reviewee?.name || review.profile?.fullName || 'Someone';
  const profileImage = review.profile?.profileImage;
  const showActions = Boolean(onEdit || onDelete);

  return (
    <div className="theme-card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {profileImage ? (
            <img
              src={profileImage}
              alt={personName}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              style={{ border: '1px solid var(--border)' }}
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
            >
              {initials(personName)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              {personName}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {formatDate(review.createdAt)}
            </p>
          </div>
        </div>

        <StarRating value={review.rating} size="sm" />
      </div>

      {review.comment ? (
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {review.comment}
        </p>
      ) : (
        <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>
          No written feedback left.
        </p>
      )}

      {!review.isVisible && (
        <span className="badge badge-warning self-start">Hidden by admin</span>
      )}

      {showActions && (
        <div className="flex items-center gap-3 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
          {onEdit && (
            <button type="button" onClick={() => onEdit(review)} className="btn btn-ghost !px-3 !py-1.5 text-xs">
              Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(review)}
              disabled={deleting}
              className="btn btn-ghost !px-3 !py-1.5 text-xs"
              style={{ color: 'var(--danger)' }}
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;