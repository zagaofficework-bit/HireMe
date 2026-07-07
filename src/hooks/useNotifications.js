// src/features/notifications/hooks/useNotifications.js
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotificationById,
} from "../api/notification.api";
import { setUnreadCount, decrementUnreadCount, resetUnreadCount } from '../features/notification/services/notification.slice';

const NOTIFICATIONS_KEY = ['notifications'];
const UNREAD_COUNT_KEY = ['notifications', 'unread-count'];

// Poll interval — bump this up if/when Socket.io push lands (see notification.model.js notes)
const POLL_INTERVAL = 30_000;

/**
 * Lightweight hook — just the unread badge count.
 * Safe to call from Navbar; only runs while a user is logged in.
 */
export const useUnreadCount = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const query = useQuery({
    queryKey: UNREAD_COUNT_KEY,
    queryFn: fetchUnreadCount,
    enabled: !!user,
    refetchInterval: POLL_INTERVAL,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (query.data) dispatch(setUnreadCount(query.data.count));
  }, [query.data, dispatch]);

  return query;
};

/**
 * Full hook — paginated list + mutations. Used by NotificationDropdown / NotificationsPage.
 */
export const useNotifications = ({ page = 1, limit = 20, unreadOnly = false, enabled = true } = {}) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { user } = useSelector((s) => s.auth);

  const listQuery = useQuery({
    queryKey: [...NOTIFICATIONS_KEY, { page, limit, unreadOnly }],
    queryFn: () => fetchNotifications({ page, limit, unreadOnly }),
    enabled: !!user && enabled,
    refetchInterval: POLL_INTERVAL,
  });

  useEffect(() => {
    if (listQuery.data) dispatch(setUnreadCount(listQuery.data.unreadCount));
  }, [listQuery.data, dispatch]);

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
    queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_KEY });
  };

  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      dispatch(decrementUnreadCount());
      invalidateAll();
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      dispatch(resetUnreadCount());
      invalidateAll();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotificationById,
    onSuccess: invalidateAll,
  });

  return {
    notifications: listQuery.data?.notifications ?? [],
    unreadCount: listQuery.data?.unreadCount ?? 0,
    pagination: listQuery.data?.pagination,
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    refetch: listQuery.refetch,
    markAsRead: markReadMutation.mutate,
    isMarkingRead: markReadMutation.isPending,
    markAllAsRead: markAllReadMutation.mutate,
    isMarkingAllRead: markAllReadMutation.isPending,
    deleteNotification: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};