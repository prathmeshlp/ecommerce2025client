import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserOrders } from "../api/api";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";

interface OrderItem {
  productId: { _id: string; name: string; price: number; image: string };
  quantity: number;
  price: number; // This is the price at order time (discounted if applicable)
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  subtotal: number; // Added to distinguish original total
  discount?: { code: string; amount: number }; // Added to show discount info
  shippingAddress: { street: string; city: string; state: string; zip: string; country: string };
  paymentStatus: "pending" | "completed" | "failed";
  createdAt: string;
}

const Orders: React.FC = () => {
  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode<{ id: string }>(token).id : "";

  const { data: orders, isLoading, error } = useQuery<Order[]>({
    queryKey: ["orders", userId],
    queryFn: getUserOrders,
    enabled: !!userId,
  });

  console.log("Orders data:", orders);

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error loading orders</div>;

  return (
    <div className="container mx-auto p-4 mt-16">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6 text-center"
      >
        Your Orders
      </motion.h1>
      {orders && orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Order #{order._id}</h2>
                <span
                  className={`text-sm px-2 py-1 rounded ${
                    order.paymentStatus === "completed"
                      ? "bg-green-100 text-green-700"
                      : order.paymentStatus === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
              <p className="text-gray-600">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
              <div className="mt-4">
                {order.items.map((item) => {
                  const originalPrice = item.productId.price; // Original price from product
                  const finalPrice = item.price; // Price after discount (if any)
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
                          <span>₹{(finalPrice * item.quantity).toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{order.subtotal}</span>
                </div>
                {order.discount && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({order.discount.code}):</span>
                    <span>-₹{order.discount.amount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>₹{order.total.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Shipping Address</h3>
                <p className="text-gray-600">
                  {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state},{" "}
                  {order.shippingAddress.zip}, {order.shippingAddress.country}
                </p>
              </div>
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
          You have no orders yet.
        </motion.p>
      )}
    </div>
  );
};

export default Orders;