import React from "react";
import ProductReviews from "./ProductReviews";

interface ProductReviewsSectionProps {
  productId: string;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({ productId }) => (
  <div className="mt-8 bg-white p-6 rounded-lg shadow-md w-1/2">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Customer Reviews</h2>
    <ProductReviews productId={productId} />
  </div>
);