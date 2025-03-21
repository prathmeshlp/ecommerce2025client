import React from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToWishlist, getWishlist } from "../api/api";
import { toast } from "react-toastify";
import { FaHeart } from "react-icons/fa";

interface ProductProps {
  product_id: string;
  productName: string;
  productPrice: number;
  productImage: string;
  discount?: {
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
  };
  onClick: () => void;
}

export interface WishlistItem {
  productId: { _id: string; name: string; price: number; image: string };
}

const Product: React.FC<ProductProps> = ({
  product_id,
  productName,
  productPrice,
  productImage,
  discount,
  onClick,
}) => {
  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: () => addToWishlist(userId!, product_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist", userId] });
      toast.success(`${productName} added to wishlist!`); // Fixed typo: 'name' → 'productName'
    },
    onError: () => toast.error("Failed to add to wishlist."),
  });

  // Fetch wishlist to check if this product is in it
  const { data: wishlist, isLoading } = useQuery<WishlistItem[]>({
    queryKey: ["wishlist", userId],
    queryFn: () => getWishlist(userId),
    enabled: !!userId,
  });

  const isInWishlist = wishlist ? wishlist.some((item) => item.productId._id === product_id) : false; 
  const heartVariants = {
    default: { scale: 1, color: "#9ca3af" }, // Gray heart
    added: { scale: [1, 1.3, 1], color: "#ef4444", transition: { duration: 0.5 } }, // Red heart with pulse
  };
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="border rounded-lg p-4 shadow-md cursor-pointer relative bg-white"
     
    >
      {discount && (
        <span className="absolute top-0 left-0 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-semibold px-3 py-1 rounded-br-lg rounded-tl-lg shadow-md">
          {discount.discountType === "percentage"
            ? `${discount.discountValue}% OFF`
            : `₹${discount.discountValue} OFF`}
        </span>
      )}
      <img
        src={productImage}
        alt={productName}
        className="w-full h-40 object-cover rounded mb-2"
        onClick={onClick}
      />
      <h3 className="text-lg font-semibold text-gray-800 truncate">{productName}</h3>
      <div className="flex items-center space-x-2 mt-1">
        <p className="text-gray-700 font-semibold">₹{productPrice.toLocaleString()}</p>
      </div>
      <div className="flex justify-between items-center">
      {discount && (
        <p className="text-xs text-gray-500 mt-1">Use code: {discount.code}</p>
      )}
      {userId && (
        <motion.button
          onClick={() => addMutation.mutate()}
          className="mt-2 p-2 rounded-full"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={addMutation.isPending || isLoading} // Disable while loading wishlist
        >
          <motion.div
            variants={heartVariants}
            initial="default"
            animate={isInWishlist ? "added" : "default"}
          >
            <FaHeart size={20} />
          </motion.div>
        </motion.button>
      )}
      </div>
    </motion.div>
  );
};

export default Product;