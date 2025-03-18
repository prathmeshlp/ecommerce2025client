import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts, getUniqueCategories } from "../api/api";
import { motion } from "framer-motion";
// import {jwtDecode} from "jwt-decode";
import Product from "../components/Product";
import FilterSidebar from "../components/FilterSidebar";
import ProductDescription from "../components/ProductDescription";
// import { jwtDecode } from "jwt-decode";



interface ProductData {
  _id: string;
  name: string;
  price: number; // Price in INR
  description: string;
  image: string;
  category: string;
  stock: number;
  avgRating?: number;
}

interface PaginatedResponse {
  products: ProductData[];
  totalProducts: number;
  currentPage: number;
  totalPages: number;
}

const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(
    null
  );
  const [page, setPage] = useState(1);
  const limit = 10; // Matches backend d
  const token = localStorage.getItem("token");
  // const userId = token ? (jwtDecode<{ id: string }>(token).id) : "exampleUserId";

  const { data: categories } = useQuery<string[]>({
    queryKey: ["categories"],
    queryFn: getUniqueCategories,
    enabled:!!token
  });

  console.log(categories,"categories")

  const { data, isLoading, error } = useQuery<PaginatedResponse>({
    queryKey: ["products", page],
    queryFn: () => getProducts({ page, limit }), // Pass pagination params
  });

  console.log(data, "data");  
  const filteredProducts = data?.products.filter((product) => {
    const matchesCategory = selectedCategory
      ? product.category === selectedCategory
      : true;
    let matchesPrice = true;
    switch (priceFilter) {
      case "below1000":
        matchesPrice = product.price < 1000;
        break;
      case "1000-3000":
        matchesPrice = product.price >= 1000 && product.price <= 3000;
        break;
      case "3000-6000":
        matchesPrice = product.price > 3000 && product.price <= 6000;
        break;
      case "above6000":
        matchesPrice = product.price > 6000;
        break;
      default:
        matchesPrice = true;
    }
    let matchesRating = true;
    const avgRating = product.avgRating ?? 0;
    switch (ratingFilter) {
      case "4above":
        matchesRating = avgRating >= 4;
        break;
      case "3above":
        matchesRating = avgRating >= 3;
        break;
      case "2above":
        matchesRating = avgRating >= 2;
        break;
      default:
        matchesRating = true;
    }
    return matchesCategory && matchesPrice && matchesRating;
  });

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (error)
    return (
      <p className="text-center mt-10 text-red-500">Error loading products</p>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 flex border-2 mt-16"
    >
      <FilterSidebar
        categories={categories || []}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        ratingFilter={ratingFilter}
        setRatingFilter={setRatingFilter}
      />
      <div className="flex-1 ml-6">
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {filteredProducts?.map((product) => (
            <Product
              key={product._id}
              product_id={product._id}
              productName={product.name}
              productPrice={product.price}
              productImage={product.image}
              onClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>
        {/* Pagination Controls */}
        {data && (
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
            >
              Previous
            </button>
            <span className="self-center">
              Page {data.currentPage} of {data.totalPages}
            </span>
            <button
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, data.totalPages))
              }
              disabled={page === data.totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductDescription
          product={selectedProduct}
          // userId={userId}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </motion.div>
  );
};

export default Home;
