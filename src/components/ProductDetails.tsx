import React from "react";
import { motion } from "framer-motion";
import { ProductData } from "../types/types";
import { PRODUCT_MESSAGES } from "../constants/productConstants";

interface ProductDetailsProps {
  product: ProductData;
  discountedPrice: number;
  savings: number;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  discountedPrice,
  savings,
  onAddToCart,
  onBuyNow,
}) => (
  <div className="space-y-4">
    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{product.name}</h1>

    {/* Pricing */}
    <div className="space-y-1">
      {product.discount ? (
        <div className="flex items-center space-x-2">
          <p className="text-2xl text-green-600 font-bold">
            ₹{discountedPrice.toLocaleString()}
          </p>
          <p className="text-lg text-gray-500 line-through">
            ₹{product.price.toLocaleString()}
          </p>
          <p className="text-sm text-red-500">
            (Save ₹{savings.toLocaleString()})
          </p>
        </div>
      ) : (
        <p className="text-2xl text-gray-700 font-semibold">
          ₹{product.price.toLocaleString()}
        </p>
      )}
      <p className={product.stock > 0 ? "text-sm text-green-500" : "text-sm text-red-500"}>
        {product.stock > 0 ? "In Stock" : "Out of Stock"}
      </p>
    </div>

    {/* Action Buttons */}
    <div className="flex space-x-4">
      <motion.button
        onClick={onAddToCart}
        className={`flex-1 p-3 rounded-lg text-white font-semibold ${
          product.stock > 0 ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-400 cursor-not-allowed"
        }`}
        whileHover={{ scale: product.stock > 0 ? 1.05 : 1 }}
        whileTap={{ scale: product.stock > 0 ? 0.95 : 1 }}
        disabled={product.stock === 0}
        aria-label={`Add ${product.name} to cart`}
      >
        {product.stock > 0 ? PRODUCT_MESSAGES.ADD_TO_CART : PRODUCT_MESSAGES.OUT_OF_STOCK_BUTTON}
      </motion.button>
      <motion.button
        onClick={onBuyNow}
        className="flex-1 p-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Buy ${product.name} now`}
      >
        {PRODUCT_MESSAGES.BUY_NOW_BUTTON}
      </motion.button>
    </div>

    {/* Highlights */}
    <div className="border-t pt-4">
      <h2 className="text-lg font-semibold text-gray-800">Product Highlights</h2>
      <ul className="list-disc list-inside text-gray-600 space-y-1 mt-2">
        <li>{product.description.split(". ")[0]}</li>
        <li>Stock: {product.stock} units</li>
        {product.discount && (
          <li>
            Discount:{" "}
            {product.discount.discountType === "percentage"
              ? `${product.discount.discountValue}% OFF`
              : `₹${product.discount.discountValue} OFF`}
          </li>
        )}
      </ul>
    </div>
  </div>
);