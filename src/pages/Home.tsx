import React from "react";
import { motion } from "framer-motion";
import { PuffLoader } from "react-spinners";
import { useProductData } from "../hooks/useProductData";
import { useProductFilters } from "../hooks/useProductFilters";
import { ProductCarousel } from "../components/ProductCarousel";
import { ProductList } from "../components/ProductList";
import FilterSidebar from "../components/FilterSidebar";
import { CAROUSEL_ITEMS } from "../constants/carousalConstants";



const Home: React.FC = () => {
  const { categories, products, isLoading, error } = useProductData();
  const {
    filters,
    setFilters,
    page,
    setPage,
    paginatedProducts,
    totalPages,
  } = useProductFilters(products);

  if (isLoading)
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <PuffLoader />
      </div>
    );

  if (error)
    return (
      <div className="w-screen h-screen flex justify-center items-center text-red-500">
        <p>Error loading products. Please try again later.</p>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 mt-16"
    >
      <ProductCarousel items={CAROUSEL_ITEMS} />
      <div className="flex">
        <FilterSidebar
          categories={categories}
          selectedCategory={filters.selectedCategory}
          setSelectedCategory={(value) => setFilters({ ...filters, selectedCategory: value })}
          priceFilter={filters.priceFilter}
          setPriceFilter={(value) => setFilters({ ...filters, priceFilter: value })}
          ratingFilter={filters.ratingFilter}
          setRatingFilter={(value) => setFilters({ ...filters, ratingFilter: value })}
        />
        <ProductList
          products={paginatedProducts}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </motion.div>
  );
};

export default Home;