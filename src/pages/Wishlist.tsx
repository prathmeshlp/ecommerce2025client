import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWishlist, removeFromWishlist } from "../api/api";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface WishlistItem {
  productId: {
    _id: string;
    name: string;
    price: number;
    image: string;
  } | null; // Allow null
  addedAt: string;
  _id: string; // Include item ID for key
}

const Wishlist: React.FC = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  let userId: string | null = null;
  try {
    userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;
  } catch (e) {
    console.error("Invalid token:", e);
    navigate("/auth");
    return null;
  }

  const queryClient = useQueryClient();

  const { data: wishlist, isLoading, error } = useQuery<WishlistItem[]>({
    queryKey: ["wishlist", userId],
    queryFn: () => getWishlist(userId!),
    enabled: !!userId,
  });

  console.log("Wishlist data:", wishlist); // Debug raw data

  const removeMutation = useMutation({
    mutationFn: ({ userId, productId }: { userId: string; productId: string }) =>
      removeFromWishlist(userId, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist", userId] });
      toast.success("Removed from wishlist!");
    },
    onError: () => toast.error("Failed to remove item."),
  });

  if (!userId) {
    return (
      <div className="text-center mt-10">
        <p className="text-xl text-gray-600">Please log in to view your wishlist.</p>
      </div>
    );
  }

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;
  if (error) {
    console.error("Wishlist fetch error:", error);
    return <div className="text-center mt-10 text-red-500">Error loading wishlist: {(error as Error).message}</div>;
  }

  return (
    <div className="container mx-auto p-4 mt-16">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6 text-center text-gray-800"
      >
        Your Wishlist
      </motion.h1>
      {wishlist && wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <motion.div
              key={item._id} // Use item._id since productId might be null
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
            >
              {item.productId ? (
                <>
                  <img
                    src={item.productId.image}
                    alt={item.productId.name}
                    className="w-32 h-32 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-700">{item.productId.name}</h3>
                  <p className="text-gray-600">₹{item.productId.price.toLocaleString()}</p>
                </>
              ) : (
                <>
                  <div className="w-32 h-32 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                    <span className="text-gray-500">Product Not Found</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">Unknown Product</h3>
                  <p className="text-gray-600">N/A</p>
                </>
              )}
              <motion.button
                onClick={() =>
                  item.productId
                    ? removeMutation.mutate({ userId: userId!, productId: item.productId._id })
                    : removeMutation.mutate({ userId: userId!, productId: item._id }) // Use item._id if productId is null
                }
                className="mt-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={removeMutation.isPending}
              >
                <FaTrash className="mr-2" />
                Remove
              </motion.button>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center text-gray-600 text-xl"
        >
          Your wishlist is empty.
        </motion.p>
      )}
    </div>
  );
};

export default Wishlist;