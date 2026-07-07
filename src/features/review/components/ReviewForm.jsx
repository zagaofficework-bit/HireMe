// src/features/reviews/components/ReviewForm.jsx
// Client writes a new review (pass profileId) or edits an existing one
// (pass existingReview). Mirrors validations/reviews/review.validation.js
// (rating 1-5 required, comment optional, max 1000 chars).
import { useState } from 'react';
import StarRating from './StarRating';
import { useCreateReview, useUpdateReview } from '../../../hooks/useReviews';

const MAX_COMMENT = 1000;

const ReviewForm = ({ profileId, existingReview = null, onSuccess, onCancel }) => {
  const isEdit = Boolean(existingReview);
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [error, setError] = useState('');

  const createMutation = useCreateReview(profileId);
  const updateMutation = useUpdateReview(profileId);
  const mutation = isEdit ? updateMutation : createMutation;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!rating) {
      setError('Please select a rating before submitting.');
      return;
    }
    if (comment.length > MAX_COMMENT) {
      setError(`Comment cannot exceed ${MAX_COMMENT} characters.`);
      return;
    }

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ reviewId: existingReview._id, rating, comment });
      } else {
        await createMutation.mutateAsync({ profileId, rating, comment });
      }
      onSuccess?.();
      if (!isEdit) {
        setRating(0);
        setComment('');
      }
    } catch (err) {
      const apiMessage = err?.response?.data?.message;
      setError(apiMessage || 'Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="theme-card p-5 flex flex-col gap-4">
      <div>
        <h3 className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          {isEdit ? 'Edit your review' : 'Write a review'}
        </h3>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {isEdit ? 'Update your rating or feedback below.' : 'Share how your experience with this professional went.'}
        </p>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
          Your rating
        </label>
        <StarRating value={rating} onChange={setRating} interactive size="lg" />
      </div>

      <div>
        <label htmlFor="review-comment" className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
          Comment <span style={{ color: 'var(--text-muted)' }}>(optional)</span>
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={MAX_COMMENT}
          rows={4}
          placeholder="What stood out about working with them?"
          className="theme-input w-full rounded-xl px-3.5 py-2.5 text-sm resize-none"
        />
        <p className="text-right text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
          {comment.length}/{MAX_COMMENT}
        </p>
      </div>

      {error && (
        <p className="text-xs font-medium" style={{ color: 'var(--danger)' }}>
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={mutation.isPending} className="btn btn-primary">
          {mutation.isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Submit review'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-ghost">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;