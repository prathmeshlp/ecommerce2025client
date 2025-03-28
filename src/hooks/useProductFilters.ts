import { useMemo, useState, useCallback } from "react";
import { ProductData, FilterState } from "../types/types";
import { PRICE_FILTERS, RATING_FILTERS, ITEMS_PER_PAGE } from "../constants/filterConstants";

type FilterFunction = (product: ProductData) => boolean;

export const useProductFilters = (products: ProductData[]) => {
  const [filters, setFilters] = useState<FilterState>({
    selectedCategory: null,
    priceFilter: PRICE_FILTERS.ALL,
    ratingFilter: RATING_FILTERS.ALL,
  });
  const [page, setPage] = useState(1);



  const applyCategoryFilter = useCallback<FilterFunction>(
    (product) => (filters.selectedCategory ? product.category === filters.selectedCategory : true),
    [filters.selectedCategory]
  );

  const applyPriceFilter = useCallback<FilterFunction>(
    (product) => {
      const price = product.price;
      switch (filters.priceFilter) {
        case PRICE_FILTERS.BELOW_1000:
          return price < 1000;
        case PRICE_FILTERS.RANGE_1000_3000:
          return price >= 1000 && price <= 3000;
        case PRICE_FILTERS.RANGE_3000_6000:
          return price > 3000 && price <= 6000;
        case PRICE_FILTERS.ABOVE_6000:
          return price > 6000;
        default:
          return true;
      }
    },
    [filters.priceFilter]
  );

  const applyRatingFilter = useCallback<FilterFunction>(
    (product) => {
      const rating = product.avgRating ?? 0;
      switch (filters.ratingFilter) {
        case RATING_FILTERS.ABOVE_4:
          return rating >= 4;
        case RATING_FILTERS.ABOVE_3:
          return rating >= 3;
        case RATING_FILTERS.ABOVE_2:
          return rating >= 2;
        default:
          return true;
      }
    },
    [filters.ratingFilter]
  );

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        applyCategoryFilter(product) && applyPriceFilter(product) && applyRatingFilter(product)
    );
  }, [products, applyCategoryFilter, applyPriceFilter, applyRatingFilter]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, page]);

  return {
    filters,
    setFilters,
    page,
    setPage,
    filteredProducts,
    paginatedProducts,
    totalPages,
  };
};