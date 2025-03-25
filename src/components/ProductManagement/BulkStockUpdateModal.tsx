import React from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { PRODUCT_BUTTONS } from "../../constants/productManagementConstants";

interface BulkStockUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProducts: string[];
  bulkStock: number;
  setBulkStock: (value: number) => void;
  onUpdate: () => void;
}

export const BulkStockUpdateModal: React.FC<BulkStockUpdateModalProps> = ({
  isOpen,
  onClose,
  selectedProducts,
  bulkStock,
  setBulkStock,
  onUpdate,
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
          <h2 className="text-xl font-semibold">Bulk Stock Update</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close modal">
            <FaTimes />
          </button>
        </div>
        <p className="mb-4">Selected Products: {selectedProducts.length}</p>
        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">New Stock Level:</label>
            <input
              type="number"
              value={bulkStock}
              onChange={(e) => setBulkStock(Number(e.target.value))}
              className="w-full p-2 border rounded"
              min="0"
              step="1"
              aria-label="New stock level"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <motion.button
            onClick={onClose}
            className="p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Cancel bulk update"
          >
            {PRODUCT_BUTTONS.CANCEL}
          </motion.button>
          <motion.button
            onClick={onUpdate}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Update stock"
          >
            {PRODUCT_BUTTONS.UPDATE_STOCK}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};