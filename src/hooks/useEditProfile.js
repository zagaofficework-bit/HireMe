// profile/hooks/useEditProfile.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createProfile,
  updateBasic,
  updateSkills,
  updateExperience,
  updateEducation,
  updatePreferences,
  updateLocation,
  updateSocial,
  updateContact,
  updateLanguages,
  updateCertifications,
  updatePortfolio,
  updateProfileImage,
  toggleVisibility,
  submitForApproval,
  deleteProfile,
} from "../api/profile.api";

const useProfileMutation = (mutationFn, options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (response, ...rest) => {
      // FIX: a resolved promise only means axios got a 2xx status — it
      // does NOT guarantee the backend actually applied the update.
      // ApiResponse always carries `success`, so check it explicitly
      // before invalidating the cache and firing the success toast.
      // Without this, a silently-empty save (e.g. the preferences
      // wrapping bug) still showed "Saved!" because the request
      // technically didn't error out.
      const body = response?.data;
      const ok = body ? body.success !== false : true;

      if (!ok) {
        options.onError?.({ response }, ...rest);
        return;
      }

      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
      options.onSuccess?.(response, ...rest);
    },
    onError: (...args) => {
      options.onError?.(...args);
    },
  });
};

export const useCreateProfile      = (opts) => useProfileMutation(createProfile, opts);
export const useUpdateBasic        = (opts) => useProfileMutation(updateBasic, opts);
export const useUpdateSkills       = (opts) => useProfileMutation(updateSkills, opts);
export const useUpdateExperience   = (opts) => useProfileMutation(updateExperience, opts);
export const useUpdateEducation    = (opts) => useProfileMutation(updateEducation, opts);
export const useUpdatePreferences  = (opts) => useProfileMutation(updatePreferences, opts);
export const useUpdateLocation     = (opts) => useProfileMutation(updateLocation, opts);
export const useUpdateSocial       = (opts) => useProfileMutation(updateSocial, opts);
export const useUpdateContact      = (opts) => useProfileMutation(updateContact, opts);
export const useUpdateLanguages    = (opts) => useProfileMutation(updateLanguages, opts);
export const useUpdateCertifications = (opts) => useProfileMutation(updateCertifications, opts);
export const useUpdatePortfolio    = (opts) => useProfileMutation(updatePortfolio, opts);
export const useUpdateProfileImage = (opts) => useProfileMutation(updateProfileImage, opts);
export const useToggleVisibility   = (opts) => useProfileMutation(toggleVisibility, opts);
export const useSubmitForApproval  = (opts) => useProfileMutation(submitForApproval, opts);
export const useDeleteProfile      = (opts) => useProfileMutation(deleteProfile, opts);