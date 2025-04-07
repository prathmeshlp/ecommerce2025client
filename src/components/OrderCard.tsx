import React from "react";
import { motion } from "framer-motion";
import { Order, OrderItem } from "../types/types";
import { ORDER_STATUS_STYLES } from "../constants/orderConstants";

interface OrderCardProps {
  order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const getStatusStyle = (status: Order["paymentStatus"]) => ORDER_STATUS_STYLES[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-4 rounded-lg shadow-md"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Order #{order._id}</h2>
        <span
          className={`text-sm px-2 py-1 rounded ${getStatusStyle(order.paymentStatus)}`}
          aria-label={`Payment status: ${order.paymentStatus}`}
        >
          {order.paymentStatus}
        </span>
      </div>
      <p className="text-gray-600">
        Placed on: {new Date(order.createdAt).toLocaleDateString()}
      </p>
      <div className="mt-4">
        {order.items.map((item: OrderItem) => {
          const originalPrice = item.productId.price;
          const finalPrice = item.price;
          const isDiscounted = finalPrice < originalPrice;

          return (
            <div key={item.productId._id} className="flex justify-between py-2 border-b">
              <span>{item.productId.name} (x{item.quantity})</span>
              <div className="flex items-center space-x-2">
                {isDiscounted ? (
                  <>
                    <span className="text-gray-400 text-sm line-through">
                      ₹{(originalPrice * item.quantity).toLocaleString()}
                    </span>
                    <span className="text-green-700 font-bold">
                      ₹{(finalPrice * item.quantity).toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-700">
                    ₹{(finalPrice * item.quantity).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal:</span>
          <span>₹{order.subtotal}</span>
        </div>
        {order.discount && order.discount.length > 0 && (
          <div className="text-green-600">
            {order.discount.map((discount, index) => (
              <div key={index} className="flex justify-between">
                <span>Discount ({discount.code}):</span>
                <span>-₹{discount.amount}</span>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-between text-lg font-semibold text-gray-800">
          <span>Total:</span>
          <span>₹{order.total}</span>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-800">Shipping Address</h3>
        <p className="text-gray-600">
          {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state},{" "}
          {order.shippingAddress.zip}, {order.shippingAddress.country}
        </p>
      </div>
    </motion.div>
  );
};