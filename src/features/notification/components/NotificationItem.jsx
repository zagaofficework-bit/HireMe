// src/features/notifications/components/NotificationItem.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAcceptHireRequest, useRejectHireRequest } from "../../../hooks/useHire";

// Map backend `type` enum → emoji icon + accent tone (keeps this file the single
// place to update when a new notification type is added to notification.model.js)
const TYPE_META = {
  profile_viewed:         { icon: '👁️', tone: 'info' },
  profile_shortlisted:    { icon: '⭐', tone: 'accent' },
  review_received:        { icon: '✨', tone: 'success' },
  account_banned:         { icon: '⛔', tone: 'danger' },
  account_suspended:      { icon: '⚠️', tone: 'warning' },
  account_unbanned:       { icon: '✅', tone: 'success' },
  verification_approved:  { icon: '🛡️', tone: 'success' },
  verification_rejected:  { icon: '❌', tone: 'danger' },
  company_verified:       { icon: '🏢', tone: 'success' },
  company_rejected:       { icon: '🏢', tone: 'danger' },
  report_resolved:        { icon: '📋', tone: 'info' },
  admin_warning:          { icon: '🔔', tone: 'warning' },
  hire_request:           { icon: '🤝', tone: 'accent' },
  hire_accepted:          { icon: '✅', tone: 'success' },
  hire_rejected:          { icon: '🚫', tone: 'danger' },
};

const timeAgo = (dateStr) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
};

const NotificationItem = ({ notification, onMarkRead, onDelete, onNavigate }) => {
  const navigate = useNavigate();
  const meta = TYPE_META[notification.type] || { icon: '🔔', tone: 'info' };

  // Once the freelancer accepts/declines here, hide the buttons immediately
  // rather than waiting on a full notification-list refetch. The hire query
  // itself is invalidated by the mutations below, so /hire/requests and the
  // unread badge both stay in sync.
  const [responded, setResponded] = useState(false);

  const { mutate: acceptRequest, isPending: isAccepting } = useAcceptHireRequest({
    onSuccess: () => setResponded(true),
  });
  const { mutate: rejectRequest, isPending: isRejecting } = useRejectHireRequest({
    onSuccess: () => setResponded(true),
  });
  const isResponding = isAccepting || isRejecting;

  // Only show quick actions on a still-actionable hire request notification —
  // refId is the HireRequest _id (see hire.controller.js's Notification.create calls).
  const isPendingHireRequest =
    notification.type === 'hire_request' &&
    notification.refModel === 'HireRequest' &&
    notification.refId &&
    !responded;

  const handleClick = () => {
    if (!notification.isRead) onMarkRead(notification._id);
    if (notification.link) {
      navigate(notification.link);
      onNavigate?.();
    }
  };

  const handleAccept = (e) => {
    e.stopPropagation();
    if (!notification.isRead) onMarkRead(notification._id);
    acceptRequest(notification.refId);
  };

  const handleReject = (e) => {
    e.stopPropagation();
    if (!notification.isRead) onMarkRead(notification._id);
    rejectRequest(notification.refId);
  };

  return (
    <div
      className={`notification-item ${notification.isRead ? '' : 'notification-item--unread'}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <span className={`notification-item__icon notification-item__icon--${meta.tone}`}>
        {meta.icon}
      </span>

      <div className="notification-item__body">
        <p className="notification-item__title">{notification.title}</p>
        <p className="notification-item__message">{notification.message}</p>
        <span className="notification-item__time">{timeAgo(notification.createdAt)}</span>

        {isPendingHireRequest && (
          <div
            className="notification-item__hire-actions"
            style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem' }}
          >
            <button
              type="button"
              className="btn btn-primary"
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.85rem' }}
              disabled={isResponding}
              onClick={handleAccept}
            >
              {isAccepting ? 'Accepting…' : 'Accept'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.85rem' }}
              disabled={isResponding}
              onClick={handleReject}
            >
              {isRejecting ? 'Declining…' : 'Decline'}
            </button>
          </div>
        )}

        {responded && (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            Responded ✓
          </p>
        )}
      </div>

      <div className="notification-item__actions">
        {!notification.isRead && <span className="notification-item__dot" aria-hidden="true" />}
        <button
          type="button"
          className="notification-item__delete"
          aria-label="Delete notification"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification._id);
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;