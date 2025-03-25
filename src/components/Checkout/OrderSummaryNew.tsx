import React from "react";
import { CartItem, AppliedDiscount } from "../../types/types";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  total: number;
  appliedDiscount: AppliedDiscount | null;
}

export const OrderSummaryNew: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  total,
  appliedDiscount,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>
    {items.map((item) => {
      const discountedPrice =
        appliedDiscount?.discountedItems.find((d) => d.productId === item.productId)?.discountedPrice ||
        item.price;
      return (
        <div key={item.productId} className="flex items-center justify-between p-2 border-b">
          <div className="flex items-center space-x-4">
            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
            <div>
              <p className="font-semibold text-gray-800">{item.name}</p>
              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
            </div>
          </div>
          {appliedDiscount && discountedPrice !== item.price ? (
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm line-through">
                ₹{(item.price * item.quantity).toLocaleString()}
              </span>
              <span className="text-green-700 font-bold">
                ₹{(discountedPrice * item.quantity).toLocaleString()}
              </span>
            </div>
          ) : (
            <span className="text-gray-700 font-semibold">
              ₹{(item.price * item.quantity).toLocaleString()}
            </span>
          )}
        </div>
      );
    })}
    <div className="mt-4 space-y-2">
      <div className="flex justify-between text-gray-600">
        <span>Subtotal:</span>
        <span>₹{subtotal.toLocaleString()}</span>
      </div>
      {appliedDiscount && (
        <div className="flex justify-between text-green-600">
          <span>Discount ({appliedDiscount.code}):</span>
          <span>-₹{appliedDiscount.discountAmount.toLocaleString()}</span>
        </div>
      )}
      <div className="flex justify-between text-xl font-semibold text-gray-800">
        <span>Total:</span>
        <span>₹{total.toLocaleString()}</span>
      </div>
    </div>
  </div>
);