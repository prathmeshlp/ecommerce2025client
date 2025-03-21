import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDiscounts, createDiscount, updateDiscount, deleteDiscount, getProductsAdmin, bulkUpdateDiscounts } from "../api/api";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaArrowLeft, FaArrowRight, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { IDiscount } from "../types/types";

interface DiscountsResponse {
  discounts: IDiscount[];
  total: number;
  currentPage: number;
  totalPages: number;
}

interface ProductsResponse {
  products: { _id: string; name: string }[];
  total: number;
  currentPage: number;
  totalPages: number;
}

const DiscountManagement: React.FC = () => {
  const token = localStorage.getItem("token");
  const role = token ? jwtDecode<{ role: string }>(token).role : "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingDiscount, setEditingDiscount] = useState<IDiscount | null>(null);
  const [newDiscount, setNewDiscount] = useState({
    code: "",
    description: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: 0,
    minOrderValue: 0,
    maxDiscountAmount: 0,
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    isActive: true,
    applicableProducts: [] as { _id: string; name: string }[],
  });
  const [page, setPage] = useState(1);
  const [productsPage, setProductsPage] = useState(1);
  const [selectedDiscounts, setSelectedDiscounts] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const limit = 10;

  const { data: discountsData, isLoading, error } = useQuery<DiscountsResponse>({
    queryKey: ["discounts", page, filterStatus],
    queryFn: () =>
      getDiscounts(page, limit).then((data) => ({
        ...data,
        discounts: data.discounts.filter((d: IDiscount) =>
          filterStatus === "all" ? true : filterStatus === "active" ? d.isActive : !d.isActive
        ),
      })),
    enabled: !!token && role === "admin",
  });

  const { data: productsData, isLoading: productsLoading } = useQuery<ProductsResponse>({
    queryKey: ["productsForDiscounts", productsPage],
    queryFn: () => getProductsAdmin(productsPage, limit),
    enabled: !!token && role === "admin",
  });

  const createMutation = useMutation({
    mutationFn: createDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["discounts"]});
      toast.success("Discount created successfully!");
      setNewDiscount({
        code: "",
        description: "",
        discountType: "percentage",
        discountValue: 0,
        minOrderValue: 0,
        maxDiscountAmount: 0,
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        isActive: true,
        applicableProducts: [],
      });
    },
    onError: () => toast.error("Failed to create discount."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ discountId, data }: { discountId: string; data: Partial<IDiscount> }) =>
      updateDiscount(discountId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["discounts"]});
      toast.success("Discount updated successfully!");
      setEditingDiscount(null);
    },
    onError: () => toast.error("Failed to update discount."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["discounts"]});
      toast.success("Discount deleted successfully!");
      if (discountsData?.discounts.length === 1 && page > 1) setPage(page - 1);
    },
    onError: () => toast.error("Failed to delete discount."),
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: ({ discountIds, isActive }: { discountIds: string[]; isActive: boolean }) =>
      bulkUpdateDiscounts(discountIds, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["discounts"]});
      setSelectedDiscounts([]);
      toast.success("Discounts updated successfully!");
    },
    onError: () => toast.error("Failed to update discounts."),
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
  if (error) return <div className="text-center mt-10 text-red-500">Error loading discounts</div>;

  const validateDiscount = (discount: Partial<IDiscount>): boolean => {
    if (!discount.code || discount.code.trim() === "") {
      toast.error("Discount code is required.");
      return false;
    }
    if ((discount.discountValue ?? 0) <= 0 || isNaN(discount.discountValue ?? 0)) {
      toast.error("Discount value must be a positive number.");
      return false;
    }
    if (discount.minOrderValue && discount.minOrderValue < 0) {
      toast.error("Minimum order value cannot be negative.");
      return false;
    }
    if (discount.maxDiscountAmount && discount.maxDiscountAmount < 0) {
      toast.error("Maximum discount amount cannot be negative.");
      return false;
    }
    if (!discount.startDate) {
      toast.error("Start date is required.");
      return false;
    }
    if (discount.endDate && new Date(discount.endDate) < new Date(discount.startDate)) {
      toast.error("End date cannot be before start date.");
      return false;
    }
    return true;
  };

  const handleAddDiscount = () => {
    if (!validateDiscount(newDiscount)) return;
    createMutation.mutate(newDiscount);
  };

  const handleEdit = (discount: IDiscount) => {
    setEditingDiscount({
      ...discount,
      startDate: new Date(discount.startDate).toISOString().split("T")[0],
      endDate: discount.endDate ? new Date(discount.endDate).toISOString().split("T")[0] : "",
    });
  };

  const handleSave = () => {
    if (editingDiscount && validateDiscount(editingDiscount)) {
      updateMutation.mutate({
        discountId: editingDiscount._id,
        data: editingDiscount,
      });
    }
  };

  const handleSelectDiscount = (discountId: string) => {
    setSelectedDiscounts((prev) =>
      prev.includes(discountId) ? prev.filter((id) => id !== discountId) : [...prev, discountId]
    );
  };

  const toggleRowExpansion = (discountId: string) => {
    setExpandedRows((prev) =>
      prev.includes(discountId) ? prev.filter((id) => id !== discountId) : [...prev, discountId]
    );
  };

  return (
    <div className="container mx-auto p-4 mt-16">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6 text-center text-gray-800"
      >
        Discount Management
      </motion.h1>

      {/* Add Discount Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-4 rounded-lg shadow-md mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">Add New Discount</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={newDiscount.code}
            onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value.toUpperCase() })}
            placeholder="Code (e.g., SAVE10)"
            className="p-2 border rounded w-full"
          />
          <input
            value={newDiscount.description}
            onChange={(e) => setNewDiscount({ ...newDiscount, description: e.target.value })}
            placeholder="Description (optional)"
            className="p-2 border rounded w-full"
          />
          <select
            value={newDiscount.discountType}
            onChange={(e) =>
              setNewDiscount({ ...newDiscount, discountType: e.target.value as "percentage" | "fixed" })
            }
            className="p-2 border rounded w-full"
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
          />
          <input
            type="number"
            value={newDiscount.minOrderValue || ""}
            onChange={(e) => setNewDiscount({ ...newDiscount, minOrderValue: Number(e.target.value) })}
            placeholder="Min Order Value (optional)"
            className="p-2 border rounded w-full"
            min="0"
            step="1"
          />
          <input
            type="number"
            value={newDiscount.maxDiscountAmount || ""}
            onChange={(e) => setNewDiscount({ ...newDiscount, maxDiscountAmount: Number(e.target.value) })}
            placeholder="Max Discount (optional)"
            className="p-2 border rounded w-full"
            min="0"
            step="1"
          />
          <input
            type="date"
            value={newDiscount.startDate}
            onChange={(e) => setNewDiscount({ ...newDiscount, startDate: e.target.value })}
            className="p-2 border rounded w-full"
          />
          <input
            type="date"
            value={newDiscount.endDate}
            onChange={(e) => setNewDiscount({ ...newDiscount, endDate: e.target.value })}
            className="p-2 border rounded w-full"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={newDiscount.isActive}
              onChange={(e) => setNewDiscount({ ...newDiscount, isActive: e.target.checked })}
            />
            <span>Active</span>
          </label>
          <div className="space-y-2">
            <select
              multiple
              value={newDiscount.applicableProducts.map(product => product._id)}
              onChange={(e) =>
                setNewDiscount({
                  ...newDiscount,
                  applicableProducts: Array.from(e.target.selectedOptions, (option) => {
                    const product = productsData?.products.find(p => p._id === option.value);
                    return product ? product : { _id: option.value, name: "" };
                  }),
                })
              }
              className="p-2 border rounded w-full h-24"
              disabled={productsLoading}
            >
              {productsData?.products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
            <div className="flex justify-between">
              <button
                onClick={() => setProductsPage((prev) => Math.max(prev - 1, 1))}
                disabled={productsPage === 1 || productsLoading}
                className="p-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {productsData?.currentPage} of {productsData?.totalPages}
              </span>
              <button
                onClick={() =>
                  setProductsPage((prev) => Math.min(prev + 1, productsData?.totalPages || 1))
                }
                disabled={productsPage === productsData?.totalPages || productsLoading}
                className="p-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
          <motion.button
            onClick={handleAddDiscount}
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus className="mr-2" /> Add Discount
          </motion.button>
        </div>
      </motion.div>

      {/* Bulk Actions and Filter */}
      <div className="mb-4 flex justify-between items-center">
        {selectedDiscounts.length > 0 && (
          <div className="space-x-2">
            <motion.button
              onClick={() => bulkUpdateMutation.mutate({ discountIds: selectedDiscounts, isActive: true })}
              className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Activate ({selectedDiscounts.length})
            </motion.button>
            <motion.button
              onClick={() => bulkUpdateMutation.mutate({ discountIds: selectedDiscounts, isActive: false })}
              className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Deactivate ({selectedDiscounts.length})
            </motion.button>
          </div>
        )}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as "all" | "active" | "inactive")}
          className="p-2 border rounded"
        >
          <option value="all">All Discounts</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Discount List */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedDiscounts(
                      e.target.checked ? discountsData?.discounts.map((d) => d._id) || [] : []
                    )
                  }
                  checked={
                    selectedDiscounts.length === discountsData?.discounts.length &&
                    discountsData?.discounts.length > 0
                  }
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
            {discountsData?.discounts.map((discount) => (
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
                        />
                      </td>
                      <td className="p-2">
                        <input
                          value={editingDiscount.code}
                          onChange={(e) =>
                            setEditingDiscount({ ...editingDiscount, code: e.target.value.toUpperCase() })
                          }
                          className="w-full p-1 border rounded"
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
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="date"
                          value={editingDiscount.endDate}
                          onChange={(e) =>
                            setEditingDiscount({ ...editingDiscount, endDate: e.target.value })
                          }
                          className="w-full p-1 border rounded"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="checkbox"
                          checked={editingDiscount.isActive}
                          onChange={(e) =>
                            setEditingDiscount({ ...editingDiscount, isActive: e.target.checked })
                          }
                        />
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
                          onClick={() => setEditingDiscount(null)}
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
                          checked={selectedDiscounts.includes(discount._id)}
                          onChange={() => handleSelectDiscount(discount._id)}
                        />
                      </td>
                      <td className="p-2">
                        {discount.code}
                        {discount.applicableProducts && discount.applicableProducts.length > 0 && (
                          <button
                            onClick={() => toggleRowExpansion(discount._id)}
                            className="ml-2 text-blue-500 hover:text-blue-700"
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
                          onClick={() => handleEdit(discount)}
                          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaEdit />
                        </motion.button>
                        <motion.button
                          onClick={() => deleteMutation.mutate(discount._id)}
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
                          <p>No specific products (applies to all).</p>
                        )}
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
            Page {discountsData?.currentPage} of {discountsData?.totalPages} (Total: {discountsData?.total})
          </span>
          <motion.button
            onClick={() => setPage((prev) => Math.min(prev + 1, discountsData?.totalPages || 1))}
            disabled={page === discountsData?.totalPages}
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

export default DiscountManagement;