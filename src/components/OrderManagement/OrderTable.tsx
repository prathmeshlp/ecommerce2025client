import React from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaArrowLeft, FaArrowRight, FaEye } from "react-icons/fa";
import { ApiResponse, Order, OrdersResponse } from "../../types/types";
import { ORDER_BUTTONS } from "../../constants/orderManagementConstants";

interface OrderTableProps {
  ordersData: ApiResponse<OrdersResponse> | undefined;
  editingOrder: Order | null;
  setEditingOrder: (order: Order | null) => void;
  expandedOrderId: string | null;
  toggleDetails: (orderId: string) => void;
  selectedOrders: string[];
  handleSelectOrder: (orderId: string | string[]) => void;
  onEdit: (order: Order) => void;
  onSave: () => void;
  onDelete: (orderId: string) => void;
  page: number;
  setPage: (page: number) => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  ordersData,
  editingOrder,
  setEditingOrder,
  expandedOrderId,
  toggleDetails,
  selectedOrders,
  handleSelectOrder,
  onEdit,
  onSave,
  onDelete,
  page,
  setPage,
}) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <table className="w-full text-left">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2">
            <input
              type="checkbox"
              onChange={(e) =>
                handleSelectOrder(e.target.checked ? ordersData?.data?.orders.map((o) => o._id) || [] : [])
              }
              checked={selectedOrders.length === ordersData?.data?.orders.length && ordersData?.data?.orders.length > 0}
              aria-label="Select all orders"
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
        {ordersData?.data?.orders.map((order) => (
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
                      aria-label={`Select order ${order._id}`}
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
                          paymentStatus: e.target.value as "pending" | "completed" | "failed",
                        })
                      }
                      className="w-full p-1 border rounded"
                      aria-label="Edit payment status"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>
                  <td className="p-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-2 flex space-x-2">
                    <motion.button
                      onClick={onSave}
                      className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Save order"
                    >
                      {ORDER_BUTTONS.SAVE}
                    </motion.button>
                    <motion.button
                      onClick={() => setEditingOrder(null)}
                      className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Cancel edit"
                    >
                      {ORDER_BUTTONS.CANCEL}
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
                      aria-label={`Select order ${order._id}`}
                    />
                  </td>
                  <td className="p-2">
                    {order._id}
                    <motion.button
                      onClick={() => toggleDetails(order._id)}
                      className="ml-2 p-1 text-blue-500 hover:text-blue-700"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={`View details for order ${order._id}`}
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
                  <td className="p-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-2 flex space-x-2">
                    <motion.button
                      onClick={() => onEdit(order)}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`Edit order ${order._id}`}
                    >
                      <FaEdit />
                    </motion.button>
                    <motion.button
                      onClick={() => onDelete(order._id)}
                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`Delete order ${order._id}`}
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
                  <div className="border-2 p-4">
                    <div>
                      <h3 className="text-lg font-semibold">Order Items</h3>
                      {order.items.map((item, index) => (
                        <div key={item.productId?._id || index} className="flex justify-start gap-4 py-2">
                          {item.productId ? (
                            <>
                              <span>{item.productId.name} (x{item.quantity})</span>
                              <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                            </>
                          ) : (
                            <>
                              <span>Product Not Found (x{item.quantity})</span>
                              <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Shipping Address</h3>
                      <p>
                        {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.zip}, {order.shippingAddress.country}
                      </p>
                      {order.razorpayOrderId && <p>Razorpay Order ID: {order.razorpayOrderId}</p>}
                      {order.paymentId && <p>Payment ID: {order.paymentId}</p>}
                    </div>
                  </div>
                </td>
              </motion.tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>

    <div className="flex justify-between items-center mt-4">
      <motion.button
        onClick={() => setPage(Math.max(page - 1, 1))}
        disabled={page === 1}
        className="p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Previous orders page"
      >
        <FaArrowLeft /> {ORDER_BUTTONS.PREV}
      </motion.button>
      <span aria-label={`Orders page ${ordersData?.data?.currentPage} of ${ordersData?.data?.totalPages}`}>
        Page {ordersData?.data?.currentPage} of {ordersData?.data?.totalPages} (Total: {ordersData?.data?.total})
      </span>
      <motion.button
        onClick={() => setPage(Math.min(page + 1, ordersData?.data?.totalPages || 1))}
        disabled={page === ordersData?.data?.totalPages}
        className="p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Next orders page"
      >
        {ORDER_BUTTONS.NEXT} <FaArrowRight />
      </motion.button>
    </div>
  </div>
);