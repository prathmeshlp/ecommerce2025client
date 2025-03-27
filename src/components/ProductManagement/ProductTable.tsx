import React from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { ApiResponse, Categories, Product, ProductsResponse } from "../../types/types";
import { PRODUCT_BUTTONS, LOW_STOCK_THRESHOLD } from "../../constants/productManagementConstants";

interface ProductTableProps {
  productsData: ApiResponse<ProductsResponse>;
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  selectedProducts: string[];
  handleSelectProduct: (productId: string | string[]) => void;
  categories: Categories | undefined;
  onEdit: (product: Product) => void;
  onSave: () => void;
  onDelete: (productId: string) => void;
  page: number;
  setPage: (page: number) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  productsData,
  editingProduct,
  setEditingProduct,
  selectedProducts,
  handleSelectProduct,
  categories,
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
                handleSelectProduct(e.target.checked ? productsData?.data?.products.map((p) => p._id!) || [] : [])
              }
              checked={selectedProducts.length === productsData?.data?.products.length && productsData?.data.products.length > 0}
              aria-label="Select all products"
            />
          </th>
          <th className="p-2">Name</th>
          <th className="p-2">Price</th>
          <th className="p-2">Category</th>
          <th className="p-2">Stock</th>
          <th className="p-2">Created At</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {productsData?.data?.products.map((product) => (
          <motion.tr
            key={product._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="border-b"
          >
            {editingProduct?._id === product._id ? (
              <>
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product._id!)}
                    onChange={() => handleSelectProduct(product._id!)}
                    aria-label={`Select product ${product.name}`}
                  />
                </td>
                <td className="p-2">
                  <input
                    value={editingProduct?.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct!, name: e.target.value })}
                    className="w-full p-1 border rounded"
                    aria-label="Edit product name"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={editingProduct?.price || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct!, price: Number(e.target.value) })}
                    className="w-full p-1 border rounded"
                    min="0"
                    step="1"
                    aria-label="Edit product price"
                  />
                </td>
                <td className="p-2">
                  <select
                    value={editingProduct?.category || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct!, category: e.target.value })}
                    className="w-full p-1 border rounded"
                    aria-label="Edit product category"
                  >
                    <option value="">Select Category</option>
                    {categories?.data?.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={editingProduct?.stock || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct!, stock: Number(e.target.value) })}
                    className="w-full p-1 border rounded"
                    min="0"
                    step="1"
                    aria-label="Edit product stock"
                  />
                </td>
                <td className="p-2">{new Date(product.createdAt!).toLocaleDateString()}</td>
                <td className="p-2 flex space-x-2">
                  <motion.button
                    onClick={onSave}
                    className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Save product"
                  >
                    {PRODUCT_BUTTONS.SAVE}
                  </motion.button>
                  <motion.button
                    onClick={() => setEditingProduct(null)}
                    className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Cancel edit"
                  >
                    {PRODUCT_BUTTONS.CANCEL}
                  </motion.button>
                </td>
              </>
            ) : (
              <>
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product._id!)}
                    onChange={() => handleSelectProduct(product._id!)}
                    aria-label={`Select product ${product.name}`}
                  />
                </td>
                <td className="p-2">{product.name}</td>
                <td className="p-2">₹{product.price.toLocaleString()}</td>
                <td className="p-2">{product.category || "N/A"}</td>
                <td className="p-2">
                  <span
                    className={product.stock! <= LOW_STOCK_THRESHOLD ? "text-red-600 font-semibold" : ""}
                  >
                    {product.stock}
                  </span>
                  {product.stock! <= LOW_STOCK_THRESHOLD && (
                    <span className="ml-2 text-xs text-red-500">(Low Stock)</span>
                  )}
                </td>
                <td className="p-2">{new Date(product.createdAt!).toLocaleDateString()}</td>
                <td className="p-2 flex space-x-2">
                  <motion.button
                    onClick={() => onEdit(product)}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Edit product ${product.name}`}
                  >
                    <FaEdit />
                  </motion.button>
                  <motion.button
                    onClick={() => onDelete(product._id!)}
                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Delete product ${product.name}`}
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

    <div className="flex justify-between items-center mt-4">
      <motion.button
        onClick={() => setPage(Math.max(page - 1, 1))}
        disabled={page === 1}
        className="p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Previous products page"
      >
        <FaArrowLeft /> {PRODUCT_BUTTONS.PREV}
      </motion.button>
      <span aria-label={`Products page ${productsData?.data?.currentPage} of ${productsData?.data?.totalPages}`}>
        Page {productsData?.data?.currentPage} of {productsData?.data?.totalPages} (Total: {productsData?.data?.total})
      </span>
      <motion.button
        onClick={() => setPage(Math.min(page + 1, productsData?.data?.totalPages || 1))}
        disabled={page === productsData?.data?.totalPages}
        className="p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Next products page"
      >
        {PRODUCT_BUTTONS.NEXT} <FaArrowRight />
      </motion.button>
    </div>
  </div>
);