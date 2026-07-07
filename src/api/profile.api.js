// profile/services/profile.api.js
import api from "./apiClient";

// ── Create / Read ───────────────────────────────────────────────────
export const createProfile = (payload) => api.post("/profiles", payload);
export const getMyProfile = () => api.get("/profiles/me");
export const getPublicProfile = (id) => api.get(`/profiles/${id}`);

// ── Section updates (PATCH /profiles/me/...) ───────────────────────

// Basic: fields sent directly (no wrapper key) — backend reads req.body.fullName etc.
export const updateBasic = (payload) =>
  api.patch("/profiles/me/basic", payload);

export const updateSkills = (skills) =>
  api.patch("/profiles/me/skills", { skills });

export const updateExperience = (experience) =>
  api.patch("/profiles/me/experience", { experience });

export const updateEducation = (education) =>
  api.patch("/profiles/me/education", { education });

// Preferences: flat, same pattern as `basic` — updatePreferencesController
// does `updateSection(req.user._id, req.body)` with NO destructuring,
// unlike location/contact/social which read `req.body.location` etc.
// CONFIRMED from profile.controller.js — do not wrap this one.
export const updatePreferences = (payload) =>
  api.patch("/profiles/me/preferences", payload);

// Location / contact / social: wrappers match what the backend reads via req.body.location etc.
export const updateLocation = (location) =>
  api.patch("/profiles/me/location", { location });

export const updateSocial = (social) =>
  api.patch("/profiles/me/social", { social });

export const updateContact = (contact) =>
  api.patch("/profiles/me/contact", { contact });

export const updateLanguages = (languages) =>
  api.patch("/profiles/me/languages", { languages });

export const updateCertifications = (certifications) =>
  api.patch("/profiles/me/certifications", { certifications });

// "Projects" in the UI — backend field/route is `portfolio`.
export const updatePortfolio = (portfolio) =>
  api.patch("/profiles/me/portfolio", { portfolio });

// ── Approval workflow ────────────────────────────────────────────────
export const submitForApproval = () => api.post("/profiles/me/submit-for-approval");

// ── Visibility / delete ─────────────────────────────────────────────
export const toggleVisibility = () => api.patch("/profiles/me/visibility");
export const deleteProfile = () => api.delete("/profiles/me");

export const updateProfileImage = (formData) =>
  api.patch("/profiles/me/photo", formData, {
    headers: { "Content-Type": undefined },
  });