import React from "react";
import { motion } from "framer-motion";

interface ProductImageProps {
  image: string;
  name: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({ image, name }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-white p-4 rounded-lg shadow-md"
  >
    <img
      src={image}
      alt={`Image of ${name}`}
      className="w-full h-96 object-contain rounded cursor-zoom-in hover:scale-105 transition-transform duration-300"
    />
  </motion.div>
);