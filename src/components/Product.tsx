import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToWishlist, getWishlist } from "../api/api";
import { toast } from "react-hot-toast";
import { FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import { Wishlist } from "../types/types";

interface ProductProps {
  product_id: string;
  productName: string;
  productPrice: number;
  productImage: string;
  onClick: () => void;
}

const Product: React.FC<ProductProps> = ({ product_id, productName, productPrice, productImage, onClick }) => {
  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;
  console.log(userId,"usedId")
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: () => addToWishlist(userId!, product_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist", userId] });
      toast.success(`${productName} added to wishlist!`);
    },
    onError: () => toast.error("Failed to add to wishlist."),
  });

  // Fetch wishlist to check if this product is in it
  const { data: wishlist } = useQuery({
    queryKey: ["wishlist", userId],
    queryFn: () => getWishlist(userId),
    enabled: !!userId,
  });

  console.log(wishlist,"wishlist")

  const isInWishlist = wishlist ? wishlist.some((item: Wishlist) => item.productId._id === product_id) : false;

  // Heart animation variants
  const heartVariants = {
    default: { scale: 1, color: "#9ca3af" }, // Gray heart
    added: { scale: [1, 1.3, 1], color: "#ef4444", transition: { duration: 0.5 } }, // Red heart with pulse
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 cursor-pointer">
      <img src={productImage} alt={productName} className="w-full h-40 object-cover rounded-md mb-2" onClick={onClick} />
      <h3 className="text-lg font-semibold">{productName}</h3>
      <p className="text-gray-600">₹{productPrice.toLocaleString()}</p>
      {userId && (
        <motion.button
          onClick={() => addMutation.mutate()}
          className="mt-2 p-2 rounded-full"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={addMutation.isPending}
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
  );
};

export default Product;