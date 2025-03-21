import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOrders,
  updateOrder,
  deleteOrder,
  bulkUpdateOrders,
} from "../api/api";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaArrowRight,
  FaTimes,
  FaEye,
} from "react-icons/fa";
import useDebounce from "../hooks/useDebounce";

interface OrderItem {
  productId: { _id: string; name: string; price: number; image: string } | null;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  userId: { _id: string; email: string };
  items: OrderItem[];
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
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
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<
    string | undefined
  >(undefined);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false); // Modal state
  const [bulkAction, setBulkAction] = useState<"update" | "delete" | null>(
    null
  );
  const [bulkStatus, setBulkStatus] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // 500ms debounce
  const limit = 10;

  const {
    data: ordersData,
    isLoading,
    error,
  } = useQuery<OrdersResponse>({
    queryKey: ["orders", page, paymentStatusFilter, debouncedSearchQuery],
    queryFn: () =>
      getOrders(page, limit, paymentStatusFilter, debouncedSearchQuery),
    enabled: !!token && role === "admin",
  });

  const updateMutation = useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: string;
      data: { paymentStatus: string };
    }) => updateOrder(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order updated successfully!");
      setEditingOrder(null);
    },
    onError: () => toast.error("Failed to update order."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order deleted successfully!");
      if (ordersData?.orders.length === 1 && page > 1) setPage(page - 1);
    },
    onError: () => toast.error("Failed to delete order."),
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: ({
      orderIds,
      action,
      paymentStatus,
    }: {
      orderIds: string[];
      action: "update" | "delete";
      paymentStatus?: string;
    }) => bulkUpdateOrders(orderIds, action, paymentStatus),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setSelectedOrders([]);
      setIsBulkModalOpen(false);
      toast.success(data.message || "Bulk action completed successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to perform bulk action.";
      toast.error(errorMessage);
    },
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
  if (error)
    return (
      <div className="text-center mt-10 text-red-500">Error loading orders</div>
    );

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
  };

  const handleSave = () => {
    if (editingOrder) {
      updateMutation.mutate({
        orderId: editingOrder._id,
        data: { paymentStatus: editingOrder.paymentStatus },
      });
    }
  };

  const toggleDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleBulkAction = () => {
    if (selectedOrders.length === 0) {
      toast.error("Please select at least one order.");
      return;
    }
    if (bulkAction === "update" && !bulkStatus) {
      toast.error("Please select a status for update.");
      return;
    }
    bulkUpdateMutation.mutate({
      orderIds: selectedOrders,
      action: bulkAction!,
      paymentStatus: bulkAction === "update" ? bulkStatus : undefined,
    });
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

      {/* Filter and Search Section */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Filter & Search Orders</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={paymentStatusFilter || ""}
            onChange={(e) => {
              setPaymentStatusFilter(e.target.value || undefined);
              setPage(1);
            }}
            className="p-2 border rounded w-full md:w-1/4"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by Order ID or Email"
            className="p-2 border rounded w-full md:w-1/2"
          />
        </div>
      </div>

      {/* Bulk Actions Button */}
      {selectedOrders.length > 0 && (
        <div className="mb-4">
          <motion.button
            onClick={() => setIsBulkModalOpen(true)}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Perform Bulk Action ({selectedOrders.length} selected)
          </motion.button>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedOrders(
                      e.target.checked
                        ? ordersData?.orders.map((o) => o._id) || []
                        : []
                    )
                  }
                  checked={
                    selectedOrders.length === ordersData?.orders.length &&
                    ordersData?.orders.length > 0
                  }
                />
              </th>
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
              <React.Fragment key={order._id}>
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="border-b"
                >
                  {editingOrder?._id === order._id ? (
                    <>
                      <td className="p-2">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order._id)}
                          onChange={() => handleSelectOrder(order._id)}
                        />
                      </td>
                      <td className="p-2">{order._id}</td>
                      <td className="p-2">{order.userId.email}</td>
                      <td className="p-2">₹{order.total.toLocaleString()}</td>
                      <td className="p-2">
                        <select
                          value={editingOrder.paymentStatus}
                          onChange={(e) =>
                            setEditingOrder({
                              ...editingOrder,
                              paymentStatus: e.target.value as
                                | "pending"
                                | "completed"
                                | "failed",
                            })
                          }
                          className="w-full p-1 border rounded"
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="failed">Failed</option>
                        </select>
                      </td>
                      <td className="p-2">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
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
                      <td className="p-2">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order._id)}
                          onChange={() => handleSelectOrder(order._id)}
                        />
                      </td>
                      <td className="p-2">
                        {order._id}
                        <motion.button
                          onClick={() => toggleDetails(order._id)}
                          className="ml-2 p-1 text-blue-500 hover:text-blue-700"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaEye />
                        </motion.button>
                      </td>
                      <td className="p-2">{order.userId?.email}</td>
                      <td className="p-2">₹{order.total.toLocaleString()}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            order.paymentStatus === "completed"
                              ? "bg-green-100 text-green-700"
                              : order.paymentStatus === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="p-2">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
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
                {expandedOrderId === order._id && (
                  <motion.tr
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-50"
                  >
                    <td colSpan={7} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-lg font-semibold">Order Items</h3>
                          {order.items.map((item, index) => (
                            <div
                              key={item.productId?._id || index}
                              className="flex justify-between py-2"
                            >
                              {item.productId ? (
                                <>
                                  <span>
                                    {item.productId.name} (x{item.quantity})
                                  </span>
                                  <span>
                                    ₹
                                    {(
                                      item.price * item.quantity
                                    ).toLocaleString()}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span>
                                    Product Not Found (x{item.quantity})
                                  </span>
                                  <span>
                                    ₹
                                    {(
                                      item.price * item.quantity
                                    ).toLocaleString()}
                                  </span>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            Shipping Address
                          </h3>
                          <p>
                            {order.shippingAddress.street},{" "}
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state},{" "}
                            {order.shippingAddress.zip},{" "}
                            {order.shippingAddress.country}
                          </p>
                          {order.razorpayOrderId && (
                            <p>Razorpay Order ID: {order.razorpayOrderId}</p>
                          )}
                          {order.paymentId && (
                            <p>Payment ID: {order.paymentId}</p>
                          )}
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </React.Fragment>
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
            Page {ordersData?.currentPage} of {ordersData?.totalPages} (Total:{" "}
            {ordersData?.total})
          </span>
          <motion.button
            onClick={() =>
              setPage((prev) => Math.min(prev + 1, ordersData?.totalPages || 1))
            }
            disabled={page === ordersData?.totalPages}
            className="p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next <FaArrowRight />
          </motion.button>
        </div>
      </div>

      {/* Bulk Action Modal */}
      {isBulkModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Bulk Action</h2>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <p className="mb-4">Selected Orders: {selectedOrders.length}</p>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Action:</label>
                <select
                  value={bulkAction || ""}
                  onChange={(e) =>
                    setBulkAction(e.target.value as "update" | "delete" | null)
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Action</option>
                  <option value="update">Update Status</option>
                  <option value="delete">Delete</option>
                </select>
              </div>
              {bulkAction === "update" && (
                <div>
                  <label className="block mb-2 font-medium">New Status:</label>
                  <select
                    value={bulkStatus}
                    onChange={(e) => setBulkStatus(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <motion.button
                onClick={() => setIsBulkModalOpen(false)}
                className="p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleBulkAction}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={
                  !bulkAction || (bulkAction === "update" && !bulkStatus)
                }
              >
                Apply
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default OrderManagement;
