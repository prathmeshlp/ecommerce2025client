import React from "react";
import { motion } from "framer-motion";
import { useAdminDashboardData } from "../../hooks/useAdminDashboardData";
import { SummaryCards } from "../../components/AdminDashboard/SummaryCards";
import { RevenueTrendChart } from "../../components/AdminDashboard/RevenueTrendChart";
import { UserGrowthChart } from "../../components/AdminDashboard/UserGrowthChart";
import { TopProductsChart } from "../../components/AdminDashboard/TopProductsChart";
import { RecentOrders } from "../../components/AdminDashboard/RecentOrders";
import { Link } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import { DASHBOARD_MESSAGES } from "../../constants/dashboardConstants";

const AdminDashboard: React.FC = () => {
  const { token, data, isLoading, error } = useAdminDashboardData();

  if (!token || !data) return null; // Navigation handled in hook

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <PuffLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen h-screen flex justify-center items-center text-red-500">
        {DASHBOARD_MESSAGES.ERROR}
        {(error as Error).message}
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
        {DASHBOARD_MESSAGES.TITLE}
      </motion.h1>

      <div className="mb-6 flex justify-center space-x-4">
        <Link
          to="/app/admin/users"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          aria-label="Manage users"
        >
          {DASHBOARD_MESSAGES.MANAGE_USERS}
        </Link>
        <Link
          to="/app/admin/products"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          aria-label="Manage products"
        >
          {DASHBOARD_MESSAGES.MANAGE_PRODUCTS}
        </Link>
        <Link
          to="/app/admin/orders"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          aria-label="Manage orders"
        >
          {DASHBOARD_MESSAGES.MANAGE_ORDERS}
        </Link>
      </div>

      <SummaryCards data={data} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <RevenueTrendChart data={data.revenueTrend} />
        <UserGrowthChart data={data.userGrowth} />
      </div>
      <TopProductsChart data={data.topProducts} />
      <RecentOrders data={data.recentOrders} />
    </div>
  );
};

export default AdminDashboard;