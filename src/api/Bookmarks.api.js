// src/features/bookmarks/services/bookmarks.api.js
import apiClient from "./apiClient";

// All /bookmarks/* endpoints. Matches bookmark.routes.js exactly:
//   POST   /bookmarks            addBookmarkController
//   GET    /bookmarks            getBookmarksController
//   GET    /bookmarks/tags       getTagsController
//   GET    /bookmarks/check/:id  checkBookmarkController
//   PATCH  /bookmarks/:id        updateBookmarkController
//   DELETE /bookmarks/:profileId removeBookmarkController

export const addBookmarkApi = ({ profileId, tag, note }) =>
  apiClient.post("/bookmarks", { profileId, tag, note });

export const getBookmarksApi = ({ tag, page = 1, limit = 20 } = {}) =>
  apiClient.get("/bookmarks", { params: { tag, page, limit } });

export const getBookmarkTagsApi = () => apiClient.get("/bookmarks/tags");

export const checkBookmarkApi = (profileId) =>
  apiClient.get(`/bookmarks/check/${profileId}`);

export const updateBookmarkApi = (bookmarkId, { tag, note }) =>
  apiClient.patch(`/bookmarks/${bookmarkId}`, { tag, note });

export const removeBookmarkApi = (profileId) =>
  apiClient.delete(`/bookmarks/${profileId}`);
