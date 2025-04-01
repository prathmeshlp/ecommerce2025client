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
  appliedDiscounts: AppliedDiscount[]; 
  isApplyingDiscount: boolean;
  onApplyDiscount: () => void;
  onRemoveDiscount: (code: string) => void;
  cartItems: CartItem[];
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  total,
  couponCode,
  setCouponCode,
  appliedDiscounts,
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
            placeholder="Enter Coupon Code"
            className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isApplyingDiscount}
            aria-label="Coupon code input"
          />
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
        </div>
        {appliedDiscounts.map((discount) => (
          <div key={discount.code} className="flex justify-between mb-2 text-green-600">
            <span>Discount ({discount.code}):</span>
            <div className="flex items-center space-x-2">
              <span>-₹{discount.discountAmount.toLocaleString()}</span>
              <motion.button
                onClick={() => onRemoveDiscount(discount.code)}
                className="text-xs text-red-500 hover:text-red-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Remove ${discount.code} discount`}
              >
                Remove
              </motion.button>
            </div>
          </div>
        ))}
        <div className="flex justify-between text-xl font-semibold text-gray-800">
          <span>Total:</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
        <motion.button
          onClick={() => navigate("/app/checkout", { state: { appliedDiscounts, cartItems } })}
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
