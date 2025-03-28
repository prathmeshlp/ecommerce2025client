import React from "react";
import { ProductData } from "../../types/types";
import Product from "../Product";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface ProductListProps {
  products: ProductData[];
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  page,
  totalPages,
  onPageChange,
}) => {
  const navigate = useNavigate();

  const handleProductClick = (product: ProductData) => {
    navigate(`/app/product/${product._id}`, { state: { product } });
  };

  return (
    <div className="flex-1 ml-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {products.map((product) => (
          <Product
            key={product._id}
            product_id={product._id}
            productName={product.name}
            productPrice={product.price}
            productImage={product.image}
            discount={product.discount}
            avgRating={product.avgRating!}
            onClick={() => handleProductClick(product)}
          />
        ))}
      </div>
      {products.length > 0 && (
        <div className="mt-6 flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(Math.max(page - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            aria-label="Previous Page"
          >
            Previous
          </motion.button>
          <span className="self-center text-gray-600">
            Page {page} of {totalPages}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(Math.min(page + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            aria-label="Next Page"
          >
            Next
          </motion.button>
        </div>
      )}
    </div>
  );
};