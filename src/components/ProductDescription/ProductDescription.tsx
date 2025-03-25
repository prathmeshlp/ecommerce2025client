import React from "react";

interface ProductDescriptionProps {
  description: string;
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({ description }) => (
  <div className="mt-8 bg-white p-6 rounded-lg shadow-md w-1/2">
    <h2 className="text-xl font-semibold text-gray-800 mb-2">Product Description</h2>
    <p className="text-gray-600">{description}</p>
  </div>
);