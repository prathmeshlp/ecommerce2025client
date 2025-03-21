import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { toast } from "react-toastify";
import Modal from "./Modal";
import ProductReviews from "./ProductReviews";
import { motion } from "framer-motion";
import { ProductData } from "../types/types";


interface ProductDescriptionProps {
  product: ProductData;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDescription: React.FC<ProductDescriptionProps> = React.memo(
  ({ product, isOpen, onClose }) => {
    console.log(product, "product");
    const dispatch = useDispatch();

    const handleAddToCart = () => {
      if (product.stock < 1) {
        toast.error("Out of stock!");
        return;
      }
      dispatch(
        addToCart({
          productId: product._id,
          name: product.name,
          price: product.discount?.discountedPrice
            ? product?.discount?.discountedPrice
            : product.price,
          quantity: 1,
          image: product.image,
        })
      );
      toast.success(`${product.name} added to cart!`);
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose} title={product.name}>
        <div className="space-y-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-contain rounded"
          />
          {/* {product.discount ? (
            <>
              <p className="text-gray-500 line-through">
                ₹{product.price}
              </p>
              <p className="text-green-600 font-bold">
                ₹{product.discount.discountedPrice}
              </p>
            </>
          ) : ( */}
            <p className="text-gray-700">₹{product.price}</p>
          {/* )} */}
          <p className="text-gray-600">{product.description}</p>
          {product.avgRating !== undefined && (
            <p className="text-sm text-yellow-500">
              Rating: {product.avgRating} / 5
            </p>
          )}
          <p>Stock: {product.stock}</p>
          <motion.button
            onClick={handleAddToCart}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </motion.button>
          <ProductReviews productId={product._id} />
          <button
            onClick={onClose}
            className="w-full p-2 bg-gray-300 text-black rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </Modal>
    );
  }
);

ProductDescription.displayName = "ProductDescription";

export default ProductDescription;
