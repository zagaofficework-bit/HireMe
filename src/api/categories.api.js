import apiClient from './apiClient';

export const fetchCategories = async () => {
  const { data } = await apiClient.get('/categories');
  // response shape: { data: { categories: [...] } }
  return data.data.categories;
};