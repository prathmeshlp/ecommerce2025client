import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "../api/api";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Link } from "react-router-dom";

interface DashboardData {
  users: number;
  orders: number;
  revenue: number;
  products: number;
  recentOrders: {
    _id: string;
    userId: { email: string; username: string };
    total: number;
    paymentStatus: string;
    createdAt: string;
  }[];
  topProducts: { name: string; totalSold: number; totalRevenue: number }[];
  userGrowth: { month: string; count: number }[];
  revenueTrend: { month: string; total: number }[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const AdminDashboard: React.FC = () => {
  const token = localStorage.getItem("token");
  const role = token ? jwtDecode<{ role: string }>(token).role : "";
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["adminDashboard"],
    queryFn: getAdminDashboard,
    enabled: !!token && role === "admin",
  });

  // if (!token) {
  //   navigate("/auth");
  //   return null;
  // }

  if (role !== "admin") {
    toast.error("Admin access required!");
    navigate("/app/home");
    return null;
  }

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return (
      <div className="text-center mt-10 text-red-500">
        Error loading dashboard
      </div>
    );

  return (
    <div className="container mx-auto p-4 mt-16">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6 text-center text-gray-800"
      >
        Admin Dashboard
      </motion.h1>
      {/* Navigation */}
      <div className="mb-6 flex justify-center space-x-4">
        <Link
          to="/app/admin/users"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Manage Users
        </Link>
        <Link
          to="/app/admin/products"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Manage Products
        </Link>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          className="bg-blue-100 p-6 rounded-lg shadow-lg text-center"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-blue-800">Total Users</h2>
          <p className="text-3xl font-bold text-blue-600">{data?.users}</p>
        </motion.div>
        <motion.div
          className="bg-green-100 p-6 rounded-lg shadow-lg text-center"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-xl font-semibold text-green-800">Total Orders</h2>
          <p className="text-3xl font-bold text-green-600">{data?.orders}</p>
        </motion.div>
        <motion.div
          className="bg-yellow-100 p-6 rounded-lg shadow-lg text-center"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-yellow-800">Revenue</h2>
          <p className="text-3xl font-bold text-yellow-600">
            ₹{data?.revenue.toLocaleString()}
          </p>
        </motion.div>
        <motion.div
          className="bg-purple-100 p-6 rounded-lg shadow-lg text-center"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-purple-800">
            Total Products
          </h2>
          <p className="text-3xl font-bold text-purple-600">{data?.products}</p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-4 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Revenue Trend (Last 6 Months)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => `₹${value.toLocaleString()}`}
              />
              <Legend />
              <Bar dataKey="total" fill="#82ca9d" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* User Growth */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-4 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            User Growth (Last 6 Months)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="New Users" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Products */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-4 rounded-lg shadow-md mb-8"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Top Selling Products
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data?.topProducts}
              dataKey="totalSold"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
            >
              {data?.topProducts.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string, props) => [
                `${value} units`,
                props.payload.totalRevenue
                  ? `₹${props.payload.totalRevenue.toLocaleString()}`
                  : name,
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-4 rounded-lg shadow-md"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Recent Orders
        </h2>
        {data?.recentOrders.length ? (
          <div className="space-y-4">
            {data.recentOrders.map((order) => (
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
                    User: {order.userId.username} ({order.userId.email})
                  </p>
                  <p className="text-gray-600">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ₹{order.total.toLocaleString()}
                  </p>
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
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">No recent orders.</p>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
