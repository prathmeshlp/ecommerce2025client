import { useQuery } from "@tanstack/react-query";
import { getProducts, getUniqueCategories } from "../api/api";
import { PaginatedResponse } from "../types/types";
import { getToken } from "../api/auth";

export const useProductData = () => {
  const token = getToken();

  const categoriesQuery = useQuery<string[]>({
    queryKey: ["categories"],
    queryFn: getUniqueCategories,
    enabled: !!token,
  });

  const productsQuery = useQuery<PaginatedResponse>({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  return {
    categories: categoriesQuery.data || [],
    products: productsQuery.data?.products || [],
    isLoading: productsQuery.isLoading || categoriesQuery.isLoading,
    error: productsQuery.error || categoriesQuery.error,
  };
};