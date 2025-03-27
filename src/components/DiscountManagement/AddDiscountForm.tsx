import React from "react";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import { DISCOUNT_MESSAGES, DISCOUNT_BUTTONS } from "../../constants/discountConstants";
import { ApiResponse, ProductsResponse } from "../../types/types";


interface AddDiscountFormProps {
  newDiscount: {
    code: string;
    description: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    minOrderValue: number;
    maxDiscountAmount: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    applicableProducts: { _id: string; name: string }[];
  };
  setNewDiscount: (discount: {
    code: string;
    description: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    minOrderValue: number;
    maxDiscountAmount: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    applicableProducts: { _id: string; name: string }[];
  }) => void;
  productsData: ApiResponse<ProductsResponse> | undefined;
  productsLoading: boolean;
  productsPage: number;
  setProductsPage: (page: number) => number;
  onAddDiscount: () => void;
}

export const AddDiscountForm: React.FC<AddDiscountFormProps> = ({
  newDiscount,
  setNewDiscount,
  productsData,
  productsLoading,
  productsPage,
  setProductsPage,
  onAddDiscount,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-white p-4 rounded-lg shadow-md mb-8"
  >
    <h2 className="text-xl font-semibold mb-4">{DISCOUNT_MESSAGES.ADD_NEW}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        value={newDiscount.code || ""}
        onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value.toUpperCase() })}
        placeholder="Code (e.g., SAVE10)"
        className="p-2 border rounded w-full"
        aria-label="Discount code"
      />
      <input
        value={newDiscount.description || ""}
        onChange={(e) => setNewDiscount({ ...newDiscount, description: e.target.value })}
        placeholder="Description (optional)"
        className="p-2 border rounded w-full"
        aria-label="Discount description"
      />
      <select
        value={newDiscount.discountType || "percentage"}
        onChange={(e) =>
          setNewDiscount({ ...newDiscount, discountType: e.target.value as "percentage" | "fixed" })
        }
        className="p-2 border rounded w-full"
        aria-label="Discount type"
      >
        <option value="percentage">Percentage</option>
        <option value="fixed">Fixed Amount</option>
      </select>
      <input
        type="number"
        value={newDiscount.discountValue || ""}
        onChange={(e) => setNewDiscount({ ...newDiscount, discountValue: Number(e.target.value) })}
        placeholder="Discount Value"
        className="p-2 border rounded w-full"
        min="0"
        step="1"
        aria-label="Discount value"
      />
      <input
        type="number"
        value={newDiscount.minOrderValue || ""}
        onChange={(e) => setNewDiscount({ ...newDiscount, minOrderValue: Number(e.target.value) })}
        placeholder="Min Order Value (optional)"
        className="p-2 border rounded w-full"
        min="0"
        step="1"
        aria-label="Minimum order value"
      />
      <input
        type="number"
        value={newDiscount.maxDiscountAmount || ""}
        onChange={(e) => setNewDiscount({ ...newDiscount, maxDiscountAmount: Number(e.target.value) })}
        placeholder="Max Discount (optional)"
        className="p-2 border rounded w-full"
        min="0"
        step="1"
        aria-label="Maximum discount amount"
      />
      <input
        type="date"
        value={newDiscount.startDate || ""}
        onChange={(e) => setNewDiscount({ ...newDiscount, startDate: e.target.value })}
        className="p-2 border rounded w-full"
        aria-label="Start date"
      />
      <input
        type="date"
        value={newDiscount.endDate || ""}
        onChange={(e) => setNewDiscount({ ...newDiscount, endDate: e.target.value })}
        className="p-2 border rounded w-full"
        aria-label="End date"
      />
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={newDiscount.isActive || false}
          onChange={(e) => setNewDiscount({ ...newDiscount, isActive: e.target.checked })}
          aria-label="Is active"
        />
        <span>Active</span>
      </label>
      <div className="space-y-2">
        <select
          multiple
          value={newDiscount.applicableProducts?.map((product) => product._id) || []}
          onChange={(e) =>
            setNewDiscount({
              ...newDiscount,
              applicableProducts: Array.from(e.target.selectedOptions, (option) => {
                const product = productsData?.data?.products.find((p) => p._id === option.value);
                return product && product._id
                  ? { _id: product._id, name: product.name }
                  : { _id: option.value, name: "" };
              }),
            })
          }
          className="p-2 border rounded w-full h-24"
          disabled={productsLoading}
          aria-label="Applicable products"
        >
          {productsData?.data?.products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name}
            </option>
          ))}
        </select>
        <div className="flex justify-between">
          <button
            onClick={() => setProductsPage(Math.max(productsPage - 1, 1))}
            disabled={productsPage === 1 || productsLoading}
            className="p-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            aria-label="Previous products page"
          >
            Prev
          </button>
          <span aria-label={`Products page ${productsData?.data?.currentPage} of ${productsData?.data?.totalPages}`}>
            Page {productsData?.data?.currentPage} of {productsData?.data?.totalPages}
          </span>
          <button
            onClick={() => setProductsPage(Math.min(productsPage + 1, productsData?.data?.totalPages || 1))}
            disabled={productsPage === productsData?.data?.totalPages || productsLoading}
            className="p-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            aria-label="Next products page"
          >
            Next
          </button>
        </div>
      </div>
      <motion.button
        onClick={onAddDiscount}
        className="p-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Add discount"
      >
        <FaPlus className="mr-2" /> {DISCOUNT_BUTTONS.ADD}
      </motion.button>
    </div>
  </motion.div>
);