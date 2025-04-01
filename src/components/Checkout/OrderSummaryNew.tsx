import React from "react";
import { CartItem, AppliedDiscount } from "../../types/types";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  total: number;
  appliedDiscounts: AppliedDiscount[];
}

export const OrderSummaryNew: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  total,
  appliedDiscounts,
}) => {
  const getBestDiscountedPrice = (productId: string): number => {
    const discountsForItem = appliedDiscounts
      .flatMap((d) => d.discountedItems)
      .filter((di) => di.productId === productId);
    if (discountsForItem.length === 0) {
      const item = items.find((i) => i.productId === productId);
      return item ? item.price : 0;
    }
    return Math.min(...discountsForItem.map((di) => di.discountedPrice));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Order Summary
      </h2>
      {items.map((item) => {
        const originalPrice = item.price * item.quantity;
        const discountedPrice = getBestDiscountedPrice(item.productId);
        const finalPrice = discountedPrice * item.quantity;

        return (
          <div
            key={item.productId}
            className="flex items-center justify-between p-2 border-b"
          >
            <div className="flex items-center space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {discountedPrice !== item.price ? (
                <>
                  <span className="text-gray-400 text-sm line-through">
                    ₹{originalPrice.toLocaleString()}
                  </span>
                  <span className="text-green-700 font-bold">
                    ₹{finalPrice.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-gray-700 font-semibold">
                  ₹{originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        );
      })}
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Total without discount:</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>
        {appliedDiscounts.map((discount) => (
          <div
            key={discount.code}
            className="flex justify-between text-green-600"
          >
            <span>Discount ({discount.code}):</span>
            <span>-₹{discount.discountAmount.toLocaleString()}</span>
          </div>
        ))}
        <div className="flex justify-between text-xl font-semibold text-gray-800">
          <span>Total with discount:</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
