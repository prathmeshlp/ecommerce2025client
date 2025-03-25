import React from "react";
import { motion } from "framer-motion";
import { Order } from "../../types/types";
import { OrderCard } from "../OrderCard";
import { ORDER_MESSAGES } from "../../constants/orderConstants";

interface OrderListProps {
  orders: Order[];
}

export const OrderList: React.FC<OrderListProps> = ({ orders }) => (
  <>
    {orders.length > 0 ? (
      <div className="space-y-6">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    ) : (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center text-gray-600 text-xl"
      >
        {ORDER_MESSAGES.NO_ORDERS}
      </motion.p>
    )}
  </>
);