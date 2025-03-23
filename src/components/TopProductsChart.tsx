import React from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { DashboardData } from "../types/types";
import { DASHBOARD_MESSAGES, COLORS } from "../constants/dashboardConstants";

interface TopProductsChartProps {
  data: DashboardData["topProducts"];
}

export const TopProductsChart: React.FC<TopProductsChartProps> = ({ data }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-white p-4 rounded-lg shadow-md mb-8"
  >
    <h2 className="text-xl font-semibold mb-4 text-gray-800">{DASHBOARD_MESSAGES.TOP_PRODUCTS}</h2>
    {data?.length ? (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="totalSold"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, _name: string, props) => [
              `${value} units`,
              `₹${props.payload.totalRevenue.toLocaleString()}`,
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    ) : (
      <p className="text-gray-600 text-center">{DASHBOARD_MESSAGES.NO_TOP_PRODUCTS}</p>
    )}
  </motion.div>
);