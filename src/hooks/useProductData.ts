import { useQuery } from "@tanstack/react-query";
import { getProducts, getUniqueCategories } from "../api/productApi";
import { ApiResponse, PaginatedResponse } from "../types/types";
import { getToken } from "../utils/auth";

export type Categories = string[];

export const useProductData = () => {
  const token = getToken();

  const categoriesQuery = useQuery<ApiResponse<Categories>>({
    queryKey: ["categories"],
    queryFn: getUniqueCategories,
    enabled: !!token,
  });

  // console.log(categoriesQuery,"categoriesQuery")

  const productsQuery = useQuery<PaginatedResponse>({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });
  // console.log(productsQuery,"productsQuery")

  return {
    categories: categoriesQuery?.data?.data || [],
    products: productsQuery?.data?.data?.products || [],
    isLoading: productsQuery.isLoading || categoriesQuery.isLoading,
    error: productsQuery.error || categoriesQuery.error,
  };
};