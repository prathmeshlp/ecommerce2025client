import React from "react";
import { motion } from "framer-motion";
import { DashboardData } from "../../types/types";
import { DASHBOARD_MESSAGES } from "../../constants/dashboardConstants";

interface SummaryCardsProps {
  data: DashboardData | null;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ data }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <motion.div
      className="bg-blue-100 p-6 rounded-lg shadow-lg text-center"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-blue-800">{DASHBOARD_MESSAGES.TOTAL_USERS}</h2>
      <p className="text-3xl font-bold text-blue-600">{data?.users || 0}</p>
    </motion.div>
    <motion.div
      className="bg-green-100 p-6 rounded-lg shadow-lg text-center"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h2 className="text-xl font-semibold text-green-800">{DASHBOARD_MESSAGES.TOTAL_ORDERS}</h2>
      <p className="text-3xl font-bold text-green-600">{data?.orders || 0}</p>
    </motion.div>
    <motion.div
      className="bg-yellow-100 p-6 rounded-lg shadow-lg text-center"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold text-yellow-800">{DASHBOARD_MESSAGES.REVENUE}</h2>
      <p className="text-3xl font-bold text-yellow-600">
        ₹{data?.revenue  || "0"}
      </p>
    </motion.div>
    <motion.div
      className="bg-purple-100 p-6 rounded-lg shadow-lg text-center"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-purple-800">{DASHBOARD_MESSAGES.TOTAL_PRODUCTS}</h2>
      <p className="text-3xl font-bold text-purple-600">{data?.products || 0}</p>
    </motion.div>
  </div>
);