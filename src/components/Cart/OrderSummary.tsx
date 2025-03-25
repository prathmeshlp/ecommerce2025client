import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CartItem, AppliedDiscount } from "../../types/types";
import { CART_MESSAGES } from "../../constants/cartConstants";

interface OrderSummaryProps {
  subtotal: number;
  total: number;
  couponCode: string;
  setCouponCode: (value: string) => void;
  appliedDiscount: AppliedDiscount | null;
  isApplyingDiscount: boolean;
  onApplyDiscount: () => void;
  onRemoveDiscount: () => void;
  cartItems: CartItem[];
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  total,
  couponCode,
  setCouponCode,
  appliedDiscount,
  isApplyingDiscount,
  onApplyDiscount,
  onRemoveDiscount,
  cartItems,
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-1/3">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>
        <div className="flex justify-between mb-2 text-gray-600">
          <span>Subtotal:</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex space-x-2 mb-4">
          <input
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Enter Coupon Code If Applicable"
            className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={appliedDiscount !== null || isApplyingDiscount}
            aria-label="Coupon code input"
          />
          {appliedDiscount ? (
            <motion.button
              onClick={onRemoveDiscount}
              className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Remove discount"
            >
              {CART_MESSAGES.REMOVE_DISCOUNT}
            </motion.button>
          ) : (
            <motion.button
              onClick={onApplyDiscount}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isApplyingDiscount}
              aria-label="Apply discount"
            >
              {isApplyingDiscount ? CART_MESSAGES.APPLYING_DISCOUNT : CART_MESSAGES.APPLY_DISCOUNT}
            </motion.button>
          )}
        </div>
        {appliedDiscount && (
          <div className="flex justify-between mb-2 text-green-600">
            <span>Discount ({appliedDiscount.code}):</span>
            <span>-₹{appliedDiscount.discountAmount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-xl font-semibold text-gray-800">
          <span>Total:</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
        <motion.button
          onClick={() => navigate("/app/checkout", { state: { appliedDiscount, cartItems } })}
          className="mt-4 w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Proceed to checkout"
        >
          Proceed to Checkout
        </motion.button>
      </div>
    </div>
  );
};