// src/features/bookmarks/services/bookmarks.slice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  addBookmarkApi,
  getBookmarksApi,
  getBookmarkTagsApi,
  checkBookmarkApi,
  updateBookmarkApi,
  removeBookmarkApi,
} from "../../../api/Bookmarks.api";

const extractError = (err) =>
  err?.response?.data?.message || err?.message || 'Something went wrong.';

// ─── THUNKS ─────────────────────────────────────────────────────────────────

// Fetch the client's bookmark list (optionally filtered by tag), paginated.
export const fetchBookmarks = createAsyncThunk(
  'bookmarks/fetchBookmarks',
  async ({ tag, page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await getBookmarksApi({ tag, page, limit });
      return data.data; // { bookmarks, pagination }
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

// Fetch distinct tags the client has used, for BookmarkTagFilter.
export const fetchBookmarkTags = createAsyncThunk(
  'bookmarks/fetchBookmarkTags',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getBookmarkTagsApi();
      return data.data?.tags ?? [];
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

// Check whether a single profile is bookmarked — used by BookmarkButton
// when it mounts on a profile card outside the bookmarks list itself.
export const checkBookmarkStatus = createAsyncThunk(
  'bookmarks/checkBookmarkStatus',
  async (profileId, { rejectWithValue }) => {
    try {
      const { data } = await checkBookmarkApi(profileId);
      return { profileId, bookmarked: !!data.data?.bookmarked };
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

// Add a bookmark. profileId is also passed through so BookmarkButton
// instances watching that profile flip to "bookmarked" immediately.
export const addBookmark = createAsyncThunk(
  'bookmarks/addBookmark',
  async ({ profileId, tag, note }, { rejectWithValue }) => {
    try {
      const { data } = await addBookmarkApi({ profileId, tag, note });
      return { bookmark: data.data?.bookmark, profileId };
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const updateBookmark = createAsyncThunk(
  'bookmarks/updateBookmark',
  async ({ bookmarkId, tag, note }, { rejectWithValue }) => {
    try {
      const { data } = await updateBookmarkApi(bookmarkId, { tag, note });
      return data.data?.bookmark;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

// Remove by profileId (matches DELETE /bookmarks/:profileId).
export const removeBookmark = createAsyncThunk(
  'bookmarks/removeBookmark',
  async (profileId, { rejectWithValue }) => {
    try {
      await removeBookmarkApi(profileId);
      return { profileId };
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

// ─── SLICE ──────────────────────────────────────────────────────────────────
const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState: {
    items: [],
    pagination: { total: 0, page: 1, limit: 20, pages: 1 },
    tags: [],
    // profileId -> boolean. Lets BookmarkButton anywhere in the app know
    // status instantly without a per-button fetch once it's been checked.
    statusByProfile: {},

    loading: false,       // list fetch
    tagsLoading: false,
    mutating: false,      // add/update/remove in flight
    error: null,
  },
  reducers: {
    clearBookmarksError: (state) => {
      state.error = null;
    },
    // Let a profile card set known status locally (e.g. backend already
    // told us via the profile payload) without an extra round trip.
    setBookmarkStatus: (state, { payload: { profileId, bookmarked } }) => {
      state.statusByProfile[profileId] = bookmarked;
    },
  },

  extraReducers: (builder) => {
    builder
      // ── fetchBookmarks ──────────────────────────────────────────────────
      .addCase(fetchBookmarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookmarks.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.items = payload.bookmarks ?? [];
        state.pagination = payload.pagination ?? state.pagination;
        // Keep statusByProfile in sync with what we just fetched
        state.items.forEach((b) => {
          const pid = b.profile?._id ?? b.profile;
          if (pid) state.statusByProfile[pid] = true;
        });
      })
      .addCase(fetchBookmarks.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // ── fetchBookmarkTags ───────────────────────────────────────────────
      .addCase(fetchBookmarkTags.pending, (state) => {
        state.tagsLoading = true;
      })
      .addCase(fetchBookmarkTags.fulfilled, (state, { payload }) => {
        state.tagsLoading = false;
        state.tags = payload;
      })
      .addCase(fetchBookmarkTags.rejected, (state, { payload }) => {
        state.tagsLoading = false;
        state.error = payload;
      })

      // ── checkBookmarkStatus ─────────────────────────────────────────────
      .addCase(checkBookmarkStatus.fulfilled, (state, { payload }) => {
        state.statusByProfile[payload.profileId] = payload.bookmarked;
      })

      // ── addBookmark ──────────────────────────────────────────────────────
      .addCase(addBookmark.pending, (state) => {
        state.mutating = true;
        state.error = null;
      })
      .addCase(addBookmark.fulfilled, (state, { payload }) => {
        state.mutating = false;
        state.statusByProfile[payload.profileId] = true;
        if (payload.bookmark) state.items.unshift(payload.bookmark);
      })
      .addCase(addBookmark.rejected, (state, { payload }) => {
        state.mutating = false;
        state.error = payload;
      })

      // ── updateBookmark ──────────────────────────────────────────────────
      .addCase(updateBookmark.pending, (state) => {
        state.mutating = true;
        state.error = null;
      })
      .addCase(updateBookmark.fulfilled, (state, { payload }) => {
        state.mutating = false;
        if (!payload) return;
        const idx = state.items.findIndex((b) => b._id === payload._id);
        if (idx !== -1) state.items[idx] = { ...state.items[idx], ...payload };
      })
      .addCase(updateBookmark.rejected, (state, { payload }) => {
        state.mutating = false;
        state.error = payload;
      })

      // ── removeBookmark ──────────────────────────────────────────────────
      .addCase(removeBookmark.pending, (state) => {
        state.mutating = true;
        state.error = null;
      })
      .addCase(removeBookmark.fulfilled, (state, { payload }) => {
        state.mutating = false;
        state.statusByProfile[payload.profileId] = false;
        state.items = state.items.filter(
          (b) => (b.profile?._id ?? b.profile) !== payload.profileId,
        );
      })
      .addCase(removeBookmark.rejected, (state, { payload }) => {
        state.mutating = false;
        state.error = payload;
      });
  },
});

export const { clearBookmarksError, setBookmarkStatus } = bookmarksSlice.actions;
export default bookmarksSlice.reducer;