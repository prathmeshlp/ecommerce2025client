import React from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IDiscount, DiscountsResponse, ApiResponse } from "../../types/types";
import { DISCOUNT_BUTTONS, DISCOUNT_MESSAGES } from "../../constants/discountConstants";

interface DiscountTableProps {
  discountsData: ApiResponse<DiscountsResponse> | undefined;
  editingDiscount: IDiscount | null;
  setEditingDiscount: (discount: IDiscount | null) => void;
  expandedRows: string[];
  toggleRowExpansion: (discountId: string) => void;
  selectedDiscounts: string[];
  handleSelectDiscount: (discountId: string | string[]) => void; // Updated type
  onEdit: (discount: IDiscount) => void;
  onSave: () => void;
  onDelete: (discountId: string) => void;
  page: number;
  setPage: (page: number) => void;
}

export const DiscountTable: React.FC<DiscountTableProps> = ({
  discountsData,
  editingDiscount,
  setEditingDiscount,
  expandedRows,
  toggleRowExpansion,
  selectedDiscounts,
  handleSelectDiscount,
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
                handleSelectDiscount(
                  e.target.checked ? discountsData?.data?.discounts.map((d) => d._id) || [] : []
                )
              }
              checked={
                selectedDiscounts.length === discountsData?.data?.discounts.length &&
                discountsData?.data?.discounts.length > 0
              }
              aria-label="Select all discounts"
            />
          </th>
          <th className="p-2">Code</th>
          <th className="p-2">Type</th>
          <th className="p-2">Value</th>
          <th className="p-2">Start Date</th>
          <th className="p-2">End Date</th>
          <th className="p-2">Active</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {discountsData?.data?.discounts.map((discount) => (
          <React.Fragment key={discount._id}>
            <motion.tr
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="border-b"
            >
              {editingDiscount?._id === discount._id ? (
                <>
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selectedDiscounts.includes(discount._id)}
                      onChange={() => handleSelectDiscount(discount._id)}
                      aria-label={`Select discount ${discount.code}`}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      value={editingDiscount.code}
                      onChange={(e) =>
                        setEditingDiscount({ ...editingDiscount, code: e.target.value.toUpperCase() })
                      }
                      className="w-full p-1 border rounded"
                      aria-label="Edit discount code"
                    />
                  </td>
                  <td className="p-2">
                    <select
                      value={editingDiscount.discountType}
                      onChange={(e) =>
                        setEditingDiscount({
                          ...editingDiscount,
                          discountType: e.target.value as "percentage" | "fixed",
                        })
                      }
                      className="w-full p-1 border rounded"
                      aria-label="Edit discount type"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={editingDiscount.discountValue || ""}
                      onChange={(e) =>
                        setEditingDiscount({ ...editingDiscount, discountValue: Number(e.target.value) })
                      }
                      className="w-full p-1 border rounded"
                      min="0"
                      step="1"
                      aria-label="Edit discount value"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="date"
                      value={editingDiscount.startDate}
                      onChange={(e) =>
                        setEditingDiscount({ ...editingDiscount, startDate: e.target.value })
                      }
                      className="w-full p-1 border rounded"
                      aria-label="Edit start date"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="date"
                      value={editingDiscount.endDate || ""}
                      onChange={(e) =>
                        setEditingDiscount({ ...editingDiscount, endDate: e.target.value })
                      }
                      className="w-full p-1 border rounded"
                      aria-label="Edit end date"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={editingDiscount.isActive}
                      onChange={(e) =>
                        setEditingDiscount({ ...editingDiscount, isActive: e.target.checked })
                      }
                      aria-label="Edit is active"
                    />
                  </td>
                  <td className="p-2 flex space-x-2">
                    <motion.button
                      onClick={onSave}
                      className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Save discount"
                    >
                      {DISCOUNT_BUTTONS.SAVE}
                    </motion.button>
                    <motion.button
                      onClick={() => setEditingDiscount(null)}
                      className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Cancel edit"
                    >
                      {DISCOUNT_BUTTONS.CANCEL}
                    </motion.button>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selectedDiscounts.includes(discount._id)}
                      onChange={() => handleSelectDiscount(discount._id)}
                      aria-label={`Select discount ${discount.code}`}
                    />
                  </td>
                  <td className="p-2">
                    {discount.code}
                    {discount.applicableProducts && discount.applicableProducts.length > 0 && (
                      <button
                        onClick={() => toggleRowExpansion(discount._id)}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                        aria-label={`Toggle products for ${discount.code}`}
                      >
                        {expandedRows.includes(discount._id) ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    )}
                  </td>
                  <td className="p-2">{discount.discountType}</td>
                  <td className="p-2">
                    {discount.discountType === "percentage"
                      ? `${discount.discountValue}%`
                      : `₹${discount.discountValue}`}
                  </td>
                  <td className="p-2">{new Date(discount.startDate).toLocaleDateString()}</td>
                  <td className="p-2">
                    {discount.endDate ? new Date(discount.endDate).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="p-2">{discount.isActive ? "Yes" : "No"}</td>
                  <td className="p-2 flex space-x-2">
                    <motion.button
                      onClick={() => onEdit(discount)}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`Edit discount ${discount.code}`}
                    >
                      <FaEdit />
                    </motion.button>
                    <motion.button
                      onClick={() => onDelete(discount._id)}
                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`Delete discount ${discount.code}`}
                    >
                      <FaTrash />
                    </motion.button>
                  </td>
                </>
              )}
            </motion.tr>
            {expandedRows.includes(discount._id) && !editingDiscount && (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50"
              >
                <td colSpan={8} className="p-2">
                  <div className="pl-4">
                    <strong>Applicable Products:</strong>
                    {discount.applicableProducts && discount.applicableProducts.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {discount.applicableProducts.map((product) => (
                          <li key={product._id}>{product.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>{DISCOUNT_MESSAGES.NO_PRODUCTS}</p>
                    )}
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
        aria-label="Previous discounts page"
      >
        <FaArrowLeft /> {DISCOUNT_BUTTONS.PREV}
      </motion.button>
      <span aria-label={`Discounts page ${discountsData?.data?.currentPage} of ${discountsData?.data?.totalPages}`}>
        Page {discountsData?.data?.currentPage} of {discountsData?.data?.totalPages} (Total: {discountsData?.data?.total})
      </span>
      <motion.button
        onClick={() => setPage(Math.min(page + 1, discountsData?.data?.totalPages || 1))}
        disabled={page === discountsData?.data?.totalPages}
        className="p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Next discounts page"
      >
        {DISCOUNT_BUTTONS.NEXT} <FaArrowRight />
      </motion.button>
    </div>
  </div>
);