// src/hooks/useHomepage.js
import { useQuery } from '@tanstack/react-query';
import api from '../api/apiClient';

export const useHomepageData = () => {
  return useQuery({
    queryKey: ['homepage'],
    queryFn: async () => {
      const { data } = await api.get('/homepage');
      return data.data; // { stats, topSkills, featuredProfiles, topCategories }
    },
    staleTime: 5 * 60 * 1000, // 5 min — homepage data doesn't need to be super fresh
  });
};