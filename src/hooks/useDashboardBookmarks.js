// src/features/company/hooks/useDashboardBookmarks.js
// Lightweight bookmark queries scoped to the Client Dashboard.
// Full bookmark management lives in the dedicated Bookmarks page —
// this hook only fetches what the dashboard needs: a small recent
// preview + counts for the stat tiles.
import { useQuery } from '@tanstack/react-query';
import { getBookmarksApi, getBookmarkTagsApi } from "../api/Bookmarks.api";

export const dashboardBookmarkKeys = {
  recent: () => ['dashboard', 'bookmarks', 'recent'],
  tags:   () => ['dashboard', 'bookmarks', 'tags'],
};

// Recent bookmarks preview — just the latest few, plus total count via pagination
export const useRecentBookmarks = (previewLimit = 4) =>
  useQuery({
    queryKey: dashboardBookmarkKeys.recent(),
    queryFn: async () => {
      const { data } = await getBookmarksApi({ page: 1, limit: previewLimit });
      return data.data; // { bookmarks, pagination }
    },
    staleTime: 1000 * 60 * 2,
  });

// Bookmark tags — used for the "tags" stat tile
export const useBookmarkTagsCount = () =>
  useQuery({
    queryKey: dashboardBookmarkKeys.tags(),
    queryFn: async () => {
      const { data } = await getBookmarkTagsApi();
      return data.data?.tags ?? data.data ?? [];
    },
    staleTime: 1000 * 60 * 5,
  });