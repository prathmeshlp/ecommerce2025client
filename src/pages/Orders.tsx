import React from "react";
import { motion } from "framer-motion";
import { useOrderData } from "../hooks/useOrderData";
import { OrderList } from "../components/OrderList";
import { PuffLoader } from "react-spinners";
import { ORDER_MESSAGES } from "../constants/orderConstants";

const Orders: React.FC = () => {
  const { orders, isLoading, error } = useOrderData();

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <PuffLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        {ORDER_MESSAGES.ERROR}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 mt-16">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6 text-center text-gray-800"
      >
        {ORDER_MESSAGES.TITLE}
      </motion.h1>
      <OrderList orders={orders} />
    </div>
  );
};

export default Orders;