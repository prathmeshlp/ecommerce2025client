import React from "react";
import { motion } from "framer-motion";
import { DashboardData } from "../../types/types";
import { DASHBOARD_MESSAGES, STATUS_STYLES } from "../../constants/dashboardConstants";

interface RecentOrdersProps {
  data: DashboardData["recentOrders"];
}

export const RecentOrders: React.FC<RecentOrdersProps> = ({ data }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-white p-4 rounded-lg shadow-md"
  >
    <h2 className="text-xl font-semibold mb-4 text-gray-800">{DASHBOARD_MESSAGES.RECENT_ORDERS}</h2>
    {data?.length ? (
      <div className="space-y-4">
        {data.map((order) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center border-b py-2"
          >
            <div>
              <p className="font-semibold">Order #{order._id}</p>
              <p className="text-gray-600">
                User: {order?.userId?.username} ({order?.userId?.email})
              </p>
              <p className="text-gray-600">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">₹{order.total.toLocaleString()}</p>
              <span
                className={`text-sm px-2 py-1 rounded ${STATUS_STYLES[order.paymentStatus as keyof typeof STATUS_STYLES]}`}
                aria-label={`Payment status: ${order.paymentStatus}`}
              >
                {order.paymentStatus}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    ) : (
      <p className="text-gray-600 text-center">{DASHBOARD_MESSAGES.NO_RECENT_ORDERS}</p>
    )}
  </motion.div>
);