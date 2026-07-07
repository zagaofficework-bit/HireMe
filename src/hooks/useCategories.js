import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from "../api/categories.api";

export const CATEGORIES_KEY = ['categories'];

export const useCategories = () =>
  useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn:  fetchCategories,
  });