import React from "react";
import { motion } from "framer-motion";
import { useWishlistData } from "../hooks/useWishlistData";
import { WishlistItems } from "../components/WishlistItems";
import { PuffLoader } from "react-spinners";
import { WISHLIST_MESSAGES } from "../constants/wishlistConstants";

const Wishlist: React.FC = () => {
  const {
    userId,
    wishlist,
    isLoading,
    error,
    removeMutation,
    handleRemove,
    handleProductClick,
  } = useWishlistData();

  if (!userId) {
    return (
      <div className="text-center mt-10">
        <p className="text-xl text-gray-600">{WISHLIST_MESSAGES.LOGIN}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <PuffLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        {WISHLIST_MESSAGES.ERROR}
        {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 mt-16">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6 text-center text-gray-800"
      >
        {WISHLIST_MESSAGES.TITLE}
      </motion.h1>
      <WishlistItems
        items={wishlist}
        onRemove={handleRemove}
        onProductClick={handleProductClick}
        isRemoving={removeMutation.isPending}
      />
    </div>
  );
};

export default Wishlist;