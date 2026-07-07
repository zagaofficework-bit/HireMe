// src/features/notifications/pages/NotificationsPage.jsx
import { useState } from 'react';
import { useNotifications } from '../../../hooks/useNotifications';
import NotificationItem from '../components/NotificationItem';
import MainLayout from '../../../layouts/MainLayout';

const NotificationsPage = () => {
  const [page, setPage] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const limit = 20;

  const {
    notifications,
    unreadCount,
    pagination,
    isLoading,
    isError,
    markAsRead,
    markAllAsRead,
    isMarkingAllRead,
    deleteNotification,
  } = useNotifications({ page, limit, unreadOnly });

  return (
    <MainLayout>
      <div className="profile-page notifications-page">
        <div className="notifications-page__header">
          <div>
            <h2>Notifications</h2>
            {unreadCount > 0 && (
              <p className="notifications-page__subtitle">{unreadCount} unread</p>
            )}
          </div>

          <div className="notifications-page__header-actions">
            <button
              type="button"
              className={`btn-outline btn-icon-text ${unreadOnly ? 'is-active' : ''}`}
              onClick={() => { setUnreadOnly((v) => !v); setPage(1); }}
            >
              {unreadOnly ? 'Showing unread' : 'Show unread only'}
            </button>
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
        </div>

        <div className="profile-section notifications-page__list">
          {isLoading && <p className="page-loading">Loading notifications…</p>}
          {isError && <p className="page-error">Couldn't load notifications. Try again.</p>}

          {!isLoading && !isError && notifications.length === 0 && (
            <div className="empty-state-page">
              <h2>No notifications yet</h2>
              <p>You'll see updates about your profile, reviews, and account here.</p>
            </div>
          )}

          {!isLoading && notifications.map((n) => (
            <NotificationItem
              key={n._id}
              notification={n}
              onMarkRead={markAsRead}
              onDelete={deleteNotification}
            />
          ))}
        </div>

        {pagination && pagination.pages > 1 && (
          <div className="notifications-page__pagination">
            <button
              type="button"
              className="btn-text"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Prev
            </button>
            <span>Page {pagination.page} of {pagination.pages}</span>
            <button
              type="button"
              className="btn-text"
              disabled={page >= pagination.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default NotificationsPage;