import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, updateOrder, deleteOrder } from "../api/api";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface OrderItem {
  productId: { _id: string; name: string; price: number; image: string };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  userId: { _id: string; email: string };
  items: OrderItem[];
  total: number;
  shippingAddress: { street: string; city: string; state: string; zip: string; country: string };
  paymentStatus: "pending" | "completed" | "failed";
  razorpayOrderId?: string;
  paymentId?: string;
  createdAt: string;
}

interface OrdersResponse {
  orders: Order[];
  total: number;
  currentPage: number;
  totalPages: number;
}

const OrderManagement: React.FC = () => {
  const token = localStorage.getItem("token");
  const role = token ? jwtDecode<{ role: string }>(token).role : "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: ordersData, isLoading, error } = useQuery<OrdersResponse>({
    queryKey: ["orders", page],
    queryFn: () => getOrders(page, limit),
    enabled: !!token && role === "admin",
  });

  const updateMutation = useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: { paymentStatus: string } }) =>
      updateOrder(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["orders"]});
      toast.success("Order updated successfully!");
      setEditingOrder(null);
    },
    onError: () => toast.error("Failed to update order."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["orders"]});
      toast.success("Order deleted successfully!");
      if (ordersData?.orders.length === 1 && page > 1) setPage(page - 1);
    },
    onError: () => toast.error("Failed to delete order."),
  });

  if (!token) {
    navigate("/auth");
    return null;
  }

  if (role !== "admin") {
    toast.error("Admin access required!");
    navigate("/app/home");
    return null;
  }

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error loading orders</div>;

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
  };

  const handleSave = () => {
    if (editingOrder) {
      updateMutation.mutate({ orderId: editingOrder._id, data: { paymentStatus: editingOrder.paymentStatus } });
    }
  };

  return (
    <div className="container mx-auto p-4 mt-16">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6 text-center text-gray-800"
      >
        Order Management
      </motion.h1>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Order ID</th>
              <th className="p-2">User Email</th>
              <th className="p-2">Total</th>
              <th className="p-2">Status</th>
              <th className="p-2">Created At</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ordersData?.orders.map((order) => (
              <motion.tr
                key={order._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="border-b"
              >
                {editingOrder?._id === order._id ? (
                  <>
                    <td className="p-2">{order._id}</td>
                    <td className="p-2">{order.userId.email}</td>
                    <td className="p-2">₹{order.total.toLocaleString()}</td>
                    <td className="p-2">
                      <select
                        value={editingOrder.paymentStatus}
                        onChange={(e) =>
                          setEditingOrder({ ...editingOrder, paymentStatus: e.target.value as "pending" | "completed" | "failed" })
                        }
                        className="w-full p-1 border rounded"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                      </select>
                    </td>
                    <td className="p-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-2 flex space-x-2">
                      <motion.button
                        onClick={handleSave}
                        className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Save
                      </motion.button>
                      <motion.button
                        onClick={() => setEditingOrder(null)}
                        className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Cancel
                      </motion.button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-2">{order._id}</td>
                    <td className="p-2">{order.userId.email}</td>
                    <td className="p-2">₹{order.total.toLocaleString()}</td>
                    <td className="p-2">{order.paymentStatus}</td>
                    <td className="p-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-2 flex space-x-2">
                      <motion.button
                        onClick={() => handleEdit(order)}
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaEdit />
                      </motion.button>
                      <motion.button
                        onClick={() => deleteMutation.mutate(order._id)}
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaTrash />
                      </motion.button>
                    </td>
                  </>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <motion.button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowLeft /> Previous
          </motion.button>
          <span>
            Page {ordersData?.currentPage} of {ordersData?.totalPages} (Total: {ordersData?.total})
          </span>
          <motion.button
            onClick={() => setPage((prev) => Math.min(prev + 1, ordersData?.totalPages || 1))}
            disabled={page === ordersData?.totalPages}
            className="p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next <FaArrowRight />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;