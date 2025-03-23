import React from "react";
import { motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import { WishlistItem } from "../types/types";
import { WISHLIST_MESSAGES } from "../constants/wishlistConstants";

interface WishlistCardProps {
  item: WishlistItem;
  onRemove: (item: WishlistItem) => void;
  onProductClick: (productId: string) => void;
  isRemoving: boolean;
}

export const WishlistCard: React.FC<WishlistCardProps> = ({
  item,
  onRemove,
  onProductClick,
  isRemoving,
}) => (
  <motion.div
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
          className="w-32 h-32 object-cover rounded-md mb-4 cursor-pointer"
          onClick={() => onProductClick(item?.productId?._id)}
        />
        <h3 className="text-lg font-semibold text-gray-700">{item.productId.name}</h3>
        <p className="text-gray-600">₹{item.productId.price.toLocaleString()}</p>
      </>
    ) : (
      <>
        <div className="w-32 h-32 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
          <span className="text-gray-500">{WISHLIST_MESSAGES.PRODUCT_NOT_FOUND}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-700">Unknown Product</h3>
        <p className="text-gray-600">{WISHLIST_MESSAGES.PRICE_NA}</p>
      </>
    )}
    <motion.button
      onClick={() => onRemove(item)}
      className="mt-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      disabled={isRemoving}
      aria-label={`Remove ${item.productId?.name || "unknown product"} from wishlist`}
    >
      <FaTrash className="mr-2" />
      Remove
    </motion.button>
  </motion.div>
);