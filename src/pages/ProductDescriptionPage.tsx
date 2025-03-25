import React from "react";
import { motion } from "framer-motion";
import { useProductActions } from "../hooks/useProductActions";
import { ProductImage } from "../components/ProductDescription/ProductImage";
import { ProductDetails } from "../components/ProductDescription/ProductDetails";
import { ProductDescription } from "../components/ProductDescription/ProductDescription";
import { ProductReviewsSection } from "../components/ProductDescription/ProductReviewsSection";
import { PRODUCT_MESSAGES } from "../constants/productConstants";

const ProductDescriptionPage: React.FC = () => {
  const {
    product,
    discountedPrice,
    savings,
    handleAddToCart,
    handleBuyNow,
    handleGoBack,
  } = useProductActions();

  if (!product) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-600">{PRODUCT_MESSAGES.NOT_FOUND}</p>
        <button
          onClick={handleGoBack}
          className="mt-2 text-blue-500 underline"
          aria-label="Go back to previous page"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 mt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductImage image={product.image} name={product.name} />
        <ProductDetails
          product={product}
          discountedPrice={discountedPrice}
          savings={savings}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      </div>
      <ProductDescription description={product.description} />
      <ProductReviewsSection productId={product._id} />
      <div className="mt-6 text-center">
        <motion.button
          onClick={handleGoBack}
          className="px-6 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Back to products"
        >
          {PRODUCT_MESSAGES.BACK_TO_PRODUCTS}
        </motion.button>
      </div>
    </div>
  );
};

ProductDescriptionPage.displayName = "ProductDescriptionPage";

export default ProductDescriptionPage;