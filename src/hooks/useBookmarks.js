// src/features/bookmarks/hooks/useBookmarks.js
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBookmarks,
  fetchBookmarkTags,
  checkBookmarkStatus,
  addBookmark,
  updateBookmark,
  removeBookmark,
  clearBookmarksError,
} from "../features/bookmark/services/Bookmark.slice";

// Thin wrapper so components don't import action creators / selectors
// directly — same role useQuery/useMutation would have played, just
// backed by the Redux thunks instead.
export const useBookmarks = () => {
  const dispatch = useDispatch();

  const items       = useSelector((s) => s.bookmarks.items);
  const pagination  = useSelector((s) => s.bookmarks.pagination);
  const tags        = useSelector((s) => s.bookmarks.tags);
  const loading     = useSelector((s) => s.bookmarks.loading);
  const tagsLoading = useSelector((s) => s.bookmarks.tagsLoading);
  const mutating    = useSelector((s) => s.bookmarks.mutating);
  const error       = useSelector((s) => s.bookmarks.error);

  const loadBookmarks = useCallback(
    (params) => dispatch(fetchBookmarks(params)),
    [dispatch],
  );

  const loadTags = useCallback(() => dispatch(fetchBookmarkTags()), [dispatch]);

  const addToBookmarks = useCallback(
    (payload) => dispatch(addBookmark(payload)),
    [dispatch],
  );

  const editBookmark = useCallback(
    (payload) => dispatch(updateBookmark(payload)),
    [dispatch],
  );

  const removeFromBookmarks = useCallback(
    (profileId) => dispatch(removeBookmark(profileId)),
    [dispatch],
  );

  const clearError = useCallback(() => dispatch(clearBookmarksError()), [dispatch]);

  return {
    items,
    pagination,
    tags,
    loading,
    tagsLoading,
    mutating,
    error,
    loadBookmarks,
    loadTags,
    addToBookmarks,
    editBookmark,
    removeFromBookmarks,
    clearError,
  };
};

// Standalone hook for a single BookmarkButton instance sitting on a
// profile card — only cares about one profile's status, not the full list.
export const useBookmarkStatus = (profileId) => {
  const dispatch = useDispatch();
  const bookmarked = useSelector((s) => s.bookmarks.statusByProfile[profileId]);
  const mutating = useSelector((s) => s.bookmarks.mutating);

  const check = useCallback(() => {
    if (profileId) dispatch(checkBookmarkStatus(profileId));
  }, [dispatch, profileId]);

  const toggle = useCallback(
    (tag) => {
      if (bookmarked) return dispatch(removeBookmark(profileId));
      return dispatch(addBookmark({ profileId, tag }));
    },
    [dispatch, profileId, bookmarked],
  );

  return { bookmarked: !!bookmarked, mutating, check, toggle };
};