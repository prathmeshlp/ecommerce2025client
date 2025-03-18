import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
  getUniqueCategories,
  getProductsAdmin,
} from "../api/api";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  stock: number;
  createdAt: string;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  currentPage: number;
  totalPages: number;
}

const ProductManagement: React.FC = () => {
  const token = localStorage.getItem("token");
  const role = token ? jwtDecode<{ role: string }>(token).role : "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    image: "",
    category: "",
    stock: 0,
  });
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10; // Products per page

  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery<ProductsResponse>({
    queryKey: ["products", page],
    queryFn: () => getProductsAdmin(page, limit),
    enabled: !!token && role === "admin",
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<string[]>(
    {
      queryKey: ["categories"],
      queryFn: getUniqueCategories,
      enabled: !!token && role === "admin",
    }
  );

  const createMutation = useMutation({
    mutationFn: createProductAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Product created successfully!");
      setNewProduct({ name: "", price: 0, image: "", category: "", stock: 0 });
      setIsCustomCategory(false);
    },
    onError: () => toast.error("Failed to create product."),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: Partial<Product>;
    }) => updateProductAdmin(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Product updated successfully!");
      setEditingProduct(null);
    },
    onError: () => toast.error("Failed to update product."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Product deleted successfully!");
      if (productsData?.products.length === 1 && page > 1) setPage(page - 1); // Go back if last item on page is deleted
    },
    onError: () => toast.error("Failed to delete product."),
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

  if (productsLoading || categoriesLoading)
    return <div className="text-center mt-10">Loading...</div>;
  if (productsError)
    return (
      <div className="text-center mt-10 text-red-500">
        Error loading products
      </div>
    );

  const validateProduct = (product: Partial<Product>): boolean => {
    if (!product.name || product.name.trim() === "") {
      toast.error("Product name is required.");
      return false;
    }
    if (
      product.price === undefined ||
      product.price <= 0 ||
      isNaN(product.price)
    ) {
      toast.error("Price must be a positive number.");
      return false;
    }
    if (!product.image || product.image.trim() === "") {
      toast.error("Image URL is required.");
      return false;
    }
    if (
      product.stock === undefined ||
      product.stock < 0 ||
      isNaN(product.stock)
    ) {
      toast.error("Stock must be a non-negative number.");
      return false;
    }
    if (product.category && product.category.trim() === "") {
      toast.error("Category cannot be empty if provided.");
      return false;
    }
    return true;
  };

  const handleAddProduct = () => {
    if (!validateProduct(newProduct)) return;
    createMutation.mutate(newProduct);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleSave = () => {
    if (editingProduct && validateProduct(editingProduct)) {
      updateMutation.mutate({
        productId: editingProduct._id,
        data: editingProduct,
      });
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
        Product Management
      </motion.h1>

      {/* Add Product Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-4 rounded-lg shadow-md mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            placeholder="Name"
            className="p-2 border rounded w-full"
          />
          <input
            type="number"
            value={newProduct.price || ""}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: Number(e.target.value) })
            }
            placeholder="Price"
            className="p-2 border rounded w-full"
            min="0"
            step="1"
          />
          <input
            value={newProduct.image}
            onChange={(e) =>
              setNewProduct({ ...newProduct, image: e.target.value })
            }
            placeholder="Image URL"
            className="p-2 border rounded w-full"
          />
          <div className="flex items-center space-x-2">
            {!isCustomCategory ? (
              <select
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                className="p-2 border rounded w-full"
              >
                <option value="">Select Category</option>
                {categories?.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                placeholder="New Category"
                className="p-2 border rounded w-full"
              />
            )}
            <button
              onClick={() => setIsCustomCategory(!isCustomCategory)}
              className="p-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              {isCustomCategory ? "Select" : "Add New"}
            </button>
          </div>
          <input
            type="number"
            value={newProduct.stock || ""}
            onChange={(e) =>
              setNewProduct({ ...newProduct, stock: Number(e.target.value) })
            }
            placeholder="Stock"
            className="p-2 border rounded w-full"
            min="0"
            step="1"
          />
          <motion.button
            onClick={handleAddProduct}
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus className="mr-2" /> Add Product
          </motion.button>
        </div>
      </motion.div>

      {/* Product List */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Name</th>
              <th className="p-2">Price</th>
              <th className="p-2">Category</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Created At</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productsData?.products.map((product) => (
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
                        value={editingProduct.name}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            name: e.target.value,
                          })
                        }
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={editingProduct.price || ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            price: Number(e.target.value),
                          })
                        }
                        className="w-full p-1 border rounded"
                        min="0"
                        step="1"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={editingProduct.category || ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            category: e.target.value,
                          })
                        }
                        className="w-full p-1 border rounded"
                      >
                        <option value="">Select Category</option>
                        {categories?.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                        <option value="custom">Add New Category</option>
                      </select>
                      {editingProduct.category === "custom" && (
                        <input
                          value={editingProduct.category || ""}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              category: e.target.value,
                            })
                          }
                          placeholder="New Category"
                          className="w-full p-1 border rounded mt-2"
                        />
                      )}
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={editingProduct.stock || ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            stock: Number(e.target.value),
                          })
                        }
                        className="w-full p-1 border rounded"
                        min="0"
                        step="1"
                      />
                    </td>
                    <td className="p-2">
                      {new Date(product.createdAt).toLocaleDateString()}
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
                        onClick={() => setEditingProduct(null)}
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
                    <td className="p-2">{product.name}</td>
                    <td className="p-2">₹{product.price.toLocaleString()}</td>
                    <td className="p-2">{product.category || "N/A"}</td>
                    <td className="p-2">{product.stock}</td>
                    <td className="p-2">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2 flex space-x-2">
                      <motion.button
                        onClick={() => handleEdit(product)}
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaEdit />
                      </motion.button>
                      <motion.button
                        onClick={() => deleteMutation.mutate(product._id)}
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
            Page {productsData?.currentPage} of {productsData?.totalPages}{" "}
            (Total: {productsData?.total})
          </span>
          <motion.button
            onClick={() =>
              setPage((prev) =>
                Math.min(prev + 1, productsData?.totalPages || 1)
              )
            }
            disabled={page === productsData?.totalPages}
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

export default ProductManagement;
