import React from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToWishlist, getWishlist } from "../api/wishlistApi";
import { toast } from "react-toastify";
import { FaHeart } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { PuffLoader } from "react-spinners";
import { ApiResponse, WishlistItem, } from "../types/types";

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


const Product: React.FC<ProductProps> = ({
  product_id,
  productName,
  productPrice,
  productImage,
  discount,
  onClick,
}) => {
  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode<{ id: string }>(token).id : null;
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: () => addToWishlist(userId!, product_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist", userId] });
      toast.success(`${productName} added to wishlist!`);
    },
    onError: () => toast.error("Failed to add to wishlist."),
  });

  const { data: wishlist, isLoading } = useQuery<ApiResponse<WishlistItem>>({
    queryKey: ["wishlist", userId],
    queryFn: () => getWishlist(userId!),
    enabled: !!userId,
  });

  // console.log(wishlist,"wishlist")

  const isInWishlist = Array.isArray(wishlist?.data) 
    ? wishlist.data.some((item) => item.productId._id === product_id) 
    : false;

  const heartVariants = {
    default: { scale: 1, color: "#9ca3af" }, // Gray heart
    added: { scale: [1, 1.3, 1], color: "#ef4444", transition: { duration: 0.5 } }, // Red heart with pulse
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onClick
    if (!userId) {
      toast.error("Please log in to add to wishlist.");
      return;
    }
    addMutation.mutate();
  };

  if(isLoading) return <div className="w-screen h-screen flex justify-center items-center"><PuffLoader /></div>

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
      <div className="flex items-center justify-between mt-1">
        <p className="text-gray-700 font-semibold">₹{productPrice.toLocaleString()}</p>
        {userId && (
          <motion.button
            onClick={handleWishlistClick}
            className="p-2 rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={addMutation.isPending || isLoading}
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
      {discount && <p className="text-xs text-gray-500 mt-1">Use code: {discount.code}</p>}
    </motion.div>
  );
};

export default Product;