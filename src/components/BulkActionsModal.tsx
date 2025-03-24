import React from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { ORDER_BUTTONS } from "../constants/orderManagementConstants";

interface BulkActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrders: string[];
  bulkAction: "update" | "delete" | null;
  setBulkAction: (value: "update" | "delete" | null) => void;
  bulkStatus: string;
  setBulkStatus: (value: string) => void;
  onApply: () => void;
}

export const BulkActionsModal: React.FC<BulkActionsModalProps> = ({
  isOpen,
  onClose,
  selectedOrders,
  bulkAction,
  setBulkAction,
  bulkStatus,
  setBulkStatus,
  onApply,
}) => {
  if (!isOpen) return null;

  return (
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
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close modal">
            <FaTimes />
          </button>
        </div>
        <p className="mb-4">Selected Orders: {selectedOrders.length}</p>
        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Action:</label>
            <select
              value={bulkAction || ""}
              onChange={(e) => setBulkAction(e.target.value as "update" | "delete" | null)}
              className="w-full p-2 border rounded"
              aria-label="Select bulk action"
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
                aria-label="Select new status"
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
            onClick={onClose}
            className="p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Cancel bulk action"
          >
            {ORDER_BUTTONS.CANCEL}
          </motion.button>
          <motion.button
            onClick={onApply}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!bulkAction || (bulkAction === "update" && !bulkStatus)}
            aria-label="Apply bulk action"
          >
            {ORDER_BUTTONS.APPLY}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};