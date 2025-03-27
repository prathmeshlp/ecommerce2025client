import React from "react";
import { motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import { CartItem, AppliedDiscount } from "../../types/types";

interface CartItemsListProps {
  cartItems: CartItem[];
  appliedDiscount: AppliedDiscount | null;
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export const CartItemsList: React.FC<CartItemsListProps> = ({
  cartItems,
  appliedDiscount,
  onRemoveItem,
  onUpdateQuantity,
}) => {
  console.log(appliedDiscount,"appliedDiscount")
  return (
    <div className="flex flex-col items-center w-1/2">
      {cartItems.map((item) => {
        const discountedPrice =
          appliedDiscount?.discountedItems.find((d) => d.productId === item.productId)?.discountedPrice ??
          item.price;

        return (
          <motion.div
            key={item.productId}
            className="p-4 bg-white rounded-lg shadow mb-4 w-full flex justify-between items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col justify-center items-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
              {appliedDiscount && discountedPrice !== item.price ? (
                <div className="flex items-center space-x-2">
                  <p className="text-gray-400 text-sm line-through">
                    ₹{item.price.toLocaleString()}
                  </p>
                  <p className="text-green-700 font-bold">
                    ₹{discountedPrice.toLocaleString()}
                  </p>
                </div>
              ) : (
                <p className="text-gray-700">₹{item.price.toLocaleString()}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => onUpdateQuantity(item.productId, Number(e.target.value))}
                className="w-16 p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`Quantity for ${item.name}`}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onRemoveItem(item.productId)}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                aria-label={`Remove ${item.name} from cart`}
              >
                <FaTrash />
              </motion.button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};