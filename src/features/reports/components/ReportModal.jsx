// src/features/reports/components/ReportModal.jsx
//
// NOTE: This assumes a uiSlice shaped like:
//   state.ui.reportModal = { isOpen: boolean, profileId: string | null }
// with actions `closeReportModal()` exported from '../../../store/ui.slice'
// (or wherever your uiSlice lives). Adjust the import path / selector /
// action names below to match your actual slice — I don't have that file.
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeReportModal } from '../../../store/ui.slice';
import { useReport } from '../../../hooks/useReport';

const REASONS = [
  { value: 'fake_profile', label: 'Fake profile' },
  { value: 'spam', label: 'Spam' },
  { value: 'abusive_content', label: 'Abusive content' },
  { value: 'misleading_info', label: 'Misleading information' },
  { value: 'inappropriate_image', label: 'Inappropriate image' },
  { value: 'other', label: 'Other' },
];

const ReportModal = () => {
  const dispatch = useDispatch();
  const { isOpen, profileId } = useSelector((state) => state.ui.reportModal);
  const { mutate, isPending } = useReport();

  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    if (isPending) return;
    setReason('');
    setDescription('');
    setError('');
    dispatch(closeReportModal());
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!reason) {
      setError('Please select a reason');
      return;
    }
    setError('');

    mutate(
      { profileId, reason, description: description.trim() || undefined },
      {
        onSuccess: handleClose,
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(8, 21, 20, 0.6)' }}
      onClick={handleClose}
    >
      <div
        className="theme-card w-full max-w-md p-6 animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            Report profile
          </h3>
          <button
            type="button"
            className="btn-ghost rounded-lg p-1.5"
            onClick={handleClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          Tell us what's wrong. Our team will review this report.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Reason
            </label>
            <select
              className="theme-input rounded-lg px-3 py-2 text-sm w-full"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="">Select a reason</option>
              {REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Additional details (optional)
            </label>
            <textarea
              className="theme-input rounded-lg px-3 py-2 text-sm w-full resize-none"
              rows={4}
              maxLength={1000}
              placeholder="Add any context that might help our review"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className="text-xs text-right mt-1" style={{ color: 'var(--text-muted)' }}>
              {description.length}/1000
            </p>
          </div>

          {error && (
            <p className="text-sm" style={{ color: 'var(--danger)' }}>
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" className="btn btn-ghost" onClick={handleClose} disabled={isPending}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isPending}>
              {isPending ? 'Submitting…' : 'Submit report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;