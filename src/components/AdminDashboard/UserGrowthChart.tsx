import React from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { DashboardData } from "../types/types";
import { DASHBOARD_MESSAGES } from "../constants/dashboardConstants";

interface UserGrowthChartProps {
  data: DashboardData["userGrowth"];
}

export const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ data }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-white p-4 rounded-lg shadow-md"
  >
    <h2 className="text-xl font-semibold mb-4 text-gray-800">{DASHBOARD_MESSAGES.USER_GROWTH}</h2>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data || []}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" name="New Users" />
      </BarChart>
    </ResponsiveContainer>
  </motion.div>
);