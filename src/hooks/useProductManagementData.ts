import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProductsAdmin,
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
  bulkUpdateProducts,
} from "../api/adminApi";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  ApiResponse,
  Categories,
  Product,
  ProductsResponse,
} from "../types/types";
import { PRODUCT_MESSAGES } from "../constants/productManagementConstants";
import { getUniqueCategories } from "../api/productApi";

export const useProductManagementData = () => {
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
    description: "",
  });
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkStock, setBulkStock] = useState<number>(0);
  const limit = 10;

  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery<ApiResponse<ProductsResponse>>({
    queryKey: ["products", page],
    queryFn: () => getProductsAdmin(page, limit),
    enabled: !!token && role === "admin",
  });



  const { data: categories, isLoading: categoriesLoading } = useQuery<
    ApiResponse<Categories>
  >({
    queryKey: ["categories"],
    queryFn: getUniqueCategories,
    enabled: !!token && role === "admin",
  });

  const createMutation = useMutation({
    mutationFn: createProductAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(PRODUCT_MESSAGES.CREATE_SUCCESS);
      setNewProduct({
        name: "",
        price: 0,
        image: "",
        category: "",
        stock: 0,
        description: "",
      });
      setIsCustomCategory(false);
    },
    onError: () => toast.error(PRODUCT_MESSAGES.CREATE_ERROR),
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
      toast.success(PRODUCT_MESSAGES.UPDATE_SUCCESS);
      setEditingProduct(null);
    },
    onError: () => toast.error(PRODUCT_MESSAGES.UPDATE_ERROR),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(PRODUCT_MESSAGES.DELETE_SUCCESS);
      if (productsData?.data?.products.length === 1 && page > 1)
        setPage(page - 1);
    },
    onError: () => toast.error(PRODUCT_MESSAGES.DELETE_ERROR),
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: ({
      productIds,
      stock,
    }: {
      productIds: string[];
      stock: number;
    }) => bulkUpdateProducts(productIds, stock),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setSelectedProducts([]);
      setIsBulkModalOpen(false);
      toast.success(data.message || PRODUCT_MESSAGES.BULK_SUCCESS);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || PRODUCT_MESSAGES.BULK_ERROR);
    },
  });

  const validateProduct = (product: Partial<Product>): boolean => {
    if (!product.name || product.name.trim() === "") {
      toast.error(PRODUCT_MESSAGES.NAME_REQUIRED);
      return false;
    }
    if (
      product.price === undefined ||
      product.price <= 0 ||
      isNaN(product.price)
    ) {
      toast.error(PRODUCT_MESSAGES.PRICE_POSITIVE);
      return false;
    }
    if (!product.image || product.image.trim() === "") {
      toast.error(PRODUCT_MESSAGES.IMAGE_REQUIRED);
      return false;
    }
    if (
      product.stock === undefined ||
      product.stock < 0 ||
      isNaN(product.stock)
    ) {
      toast.error(PRODUCT_MESSAGES.STOCK_NON_NEGATIVE);
      return false;
    }
    if (product.category && product.category.trim() === "") {
      toast.error(PRODUCT_MESSAGES.CATEGORY_EMPTY);
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
        productId: editingProduct._id!,
        data: editingProduct,
      });
    }
  };

  const handleSelectProduct = (productId: string | string[]) => {
    setSelectedProducts((prev) =>
      Array.isArray(productId)
        ? productId
        : prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleBulkUpdate = () => {
    if (selectedProducts.length === 0) {
      toast.error(PRODUCT_MESSAGES.NO_PRODUCTS_SELECTED);
      return;
    }
    if (bulkStock < 0 || isNaN(bulkStock)) {
      toast.error(PRODUCT_MESSAGES.STOCK_INVALID);
      return;
    }
    bulkUpdateMutation.mutate({
      productIds: selectedProducts,
      stock: bulkStock,
    });
  };

  if (!token || role !== "admin") {
    if (!token) navigate("/auth");
    else if (role !== "admin") {
      toast.error(PRODUCT_MESSAGES.ADMIN_REQUIRED);
      navigate("/app/home");
    }
    return { token: null, role: null };
  }

  return {
    token,
    role,
    productsData,
    productsLoading,
    productsError,
    categories,
    categoriesLoading,
    editingProduct,
    setEditingProduct,
    newProduct,
    setNewProduct,
    isCustomCategory,
    setIsCustomCategory,
    page,
    setPage,
    selectedProducts,
    handleSelectProduct,
    isBulkModalOpen,
    setIsBulkModalOpen,
    bulkStock,
    setBulkStock,
    handleAddProduct,
    handleEdit,
    handleSave,
    handleBulkUpdate,
    createMutation,
    updateMutation,
    deleteMutation,
    bulkUpdateMutation,
    limit,
  };
};
