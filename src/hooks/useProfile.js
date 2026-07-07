// profile/hooks/useProfile.js
//
// Read-only fetching hooks. All edit/mutation logic lives in useEditProfile.js.
import { useQuery } from '@tanstack/react-query';
import { getMyProfile, getPublicProfile } from "../api/profile.api";

// Logged-in user's own full profile -> GET /profiles/me
export const useMyProfile = () => {
  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: async () => {
      const { data } = await getMyProfile();
      return data.data.profile;
    },
  });
};

// Public profile view -> GET /profiles/:id
// canSeeContact comes back from the backend based on viewer role/verification,
// so just read it off the returned profile object — don't compute it client-side.
export const usePublicProfile = (id) => {
  return useQuery({
    queryKey: ['profile', 'public', id],
    queryFn: async () => {
      const { data } = await getPublicProfile(id);
      return data.data.profile;
    },
    enabled: !!id,
  });
};