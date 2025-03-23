import React from "react";
import { motion } from "framer-motion";
import { WishlistItem } from "../types/types";
import { WishlistCard } from "./WishlistCard";
import { WISHLIST_MESSAGES } from "../constants/wishlistConstants";

interface WishlistItemsProps {
  items: WishlistItem[];
  onRemove: (item: WishlistItem) => void;
  onProductClick: (productId: string) => void;
  isRemoving: boolean;
}

export const WishlistItems: React.FC<WishlistItemsProps> = ({
  items,
  onRemove,
  onProductClick,
  isRemoving,
}) => (
  <>
    {items.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <WishlistCard
            key={item._id}
            item={item}
            onRemove={onRemove}
            onProductClick={onProductClick}
            isRemoving={isRemoving}
          />
        ))}
      </div>
    ) : (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center text-gray-600 text-xl"
      >
        {WISHLIST_MESSAGES.EMPTY}
      </motion.p>
    )}
  </>
);