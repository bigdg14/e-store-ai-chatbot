import useFetch from "@/hooks/useFetch";
import { Category } from "@/types/products";

export const useCategories = () => {
  const {
    data: categories,
    loading,
    error,
  } = useFetch<Category[]>("/api/categories");
  return { categories, loading, error };
};
