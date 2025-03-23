import React from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DashboardData } from "../types/types";
import { DASHBOARD_MESSAGES } from "../constants/dashboardConstants";

interface RevenueTrendChartProps {
  data: DashboardData["revenueTrend"];
}

export const RevenueTrendChart: React.FC<RevenueTrendChartProps> = ({ data }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-white p-4 rounded-lg shadow-md"
  >
    <h2 className="text-xl font-semibold mb-4 text-gray-800">{DASHBOARD_MESSAGES.REVENUE_TREND}</h2>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data || []}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
        <Legend />
        <Bar dataKey="total" fill="#82ca9d" name="Revenue" />
      </BarChart>
    </ResponsiveContainer>
  </motion.div>
);