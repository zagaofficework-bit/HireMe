// src/features/reviews/pages/MyReviewsPage.jsx
// GET /reviews/my — every review the logged-in client has written,
// with inline edit (opens ReviewForm) and delete.
import { useState } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import ReviewCard from '../components/ReviewCard';
import ReviewForm from '../components/ReviewForm';
import { useMyReviews, useDeleteReview } from '../../../hooks/useReviews';

const MyReviewsPage = () => {
  const { data: reviews, isLoading, isError } = useMyReviews();
  const deleteMutation = useDeleteReview();
  const [editingReview, setEditingReview] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (review) => {
    if (!window.confirm('Delete this review? This cannot be undone.')) return;
    setDeletingId(review._id);
    try {
      await deleteMutation.mutateAsync(review._id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-black font-display" style={{ color: 'var(--text-primary)' }}>
            My Reviews
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Reviews you've written for professionals you've worked with.
          </p>
        </div>

        {editingReview && (
          <div className="mb-6">
            <ReviewForm
              existingReview={editingReview}
              onSuccess={() => setEditingReview(null)}
              onCancel={() => setEditingReview(null)}
            />
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="theme-card p-5 h-28 animate-pulse" />
            ))}
          </div>
        )}

        {isError && (
          <div className="theme-card p-6 text-center text-sm" style={{ color: 'var(--danger)' }}>
            Couldn't load your reviews. Please try again later.
          </div>
        )}

        {!isLoading && !isError && reviews?.length === 0 && (
          <div className="theme-card p-10 text-center">
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              You haven't written any reviews yet.
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Reviews you leave on professional profiles will show up here.
            </p>
          </div>
        )}

        {!isLoading && !isError && reviews?.length > 0 && (
          <div className="flex flex-col gap-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                onEdit={setEditingReview}
                onDelete={handleDelete}
                deleting={deletingId === review._id}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MyReviewsPage;