// src/features/notifications/components/NotificationDropdown.jsx
import { Link } from 'react-router-dom';
import { useNotifications } from '../../../hooks/useNotifications';
import NotificationItem from './NotificationItem';

const NotificationDropdown = ({ onClose }) => {
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    isMarkingAllRead,
    deleteNotification,
  } = useNotifications({ page: 1, limit: 8 });

  return (
    <div className="notification-dropdown">
      <div className="notification-dropdown__header">
        <h4>Notifications</h4>
        {unreadCount > 0 && (
          <button
            type="button"
            className="btn-link"
            onClick={() => markAllAsRead()}
            disabled={isMarkingAllRead}
          >
            {isMarkingAllRead ? 'Marking…' : 'Mark all read'}
          </button>
        )}
      </div>

      <div className="notification-dropdown__list">
        {isLoading && (
          <p className="notification-dropdown__empty">Loading…</p>
        )}

        {!isLoading && notifications.length === 0 && (
          <p className="notification-dropdown__empty">You're all caught up 🎉</p>
        )}

        {!isLoading && notifications.map((n) => (
          <NotificationItem
            key={n._id}
            notification={n}
            onMarkRead={markAsRead}
            onDelete={deleteNotification}
            onNavigate={onClose}
          />
        ))}
      </div>

      <Link to="/notifications" className="notification-dropdown__footer" onClick={onClose}>
        View all notifications
      </Link>
    </div>
  );
};

export default NotificationDropdown;