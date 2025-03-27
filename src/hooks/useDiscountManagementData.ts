import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDiscounts, createDiscount, updateDiscount, deleteDiscount, getProductsAdmin, bulkUpdateDiscounts } from "../api/adminApi";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { IDiscount, DiscountsResponse, ProductsResponse, ApiResponse } from "../types/types";
import { DISCOUNT_MESSAGES } from "../constants/discountConstants";

export const useDiscountManagementData = () => {
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
    isActive: false,
    applicableProducts: [] as { _id: string; name: string }[],
  });
  const [page, setPage] = useState(1);
  const [productsPage, setProductsPage] = useState(1);
  const [selectedDiscounts, setSelectedDiscounts] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const limit = 10;

  const { data: discountsData, isLoading, error } = useQuery<ApiResponse<DiscountsResponse>>({
    queryKey: ["discounts", page, filterStatus],
    queryFn: () => getDiscounts(page, limit),
    enabled: !!token && role === "admin",
  });

  console.log(discountsData,"disdata")

  const filteredDiscounts = useMemo(() => {
    if (!discountsData) return [];
    return discountsData?.data?.discounts?.filter((d) =>
      filterStatus === "all" ? true : filterStatus === "active" ? d.isActive : !d.isActive
    );
  }, [discountsData, filterStatus]);

  const { data: productsData, isLoading: productsLoading } = useQuery<ApiResponse<ProductsResponse>>({
    queryKey: ["productsForDiscounts", productsPage],
    queryFn: () => getProductsAdmin(productsPage, limit),
    enabled: !!token && role === "admin",
  });

  const createMutation = useMutation({
    mutationFn: createDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
      toast.success(DISCOUNT_MESSAGES.CREATE_SUCCESS);
      setNewDiscount({
        code: "",
        description: "",
        discountType: "percentage",
        discountValue: 0,
        minOrderValue: 0,
        maxDiscountAmount: 0,
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        isActive: false,
        applicableProducts: [],
      });
    },
    onError: () => toast.error(DISCOUNT_MESSAGES.CREATE_ERROR),
  });

  const updateMutation = useMutation({
    mutationFn: ({ discountId, data }: { discountId: string; data: Partial<IDiscount> }) =>
      updateDiscount(discountId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
      toast.success(DISCOUNT_MESSAGES.UPDATE_SUCCESS);
      setEditingDiscount(null);
    },
    onError: () => toast.error(DISCOUNT_MESSAGES.UPDATE_ERROR),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
      toast.success(DISCOUNT_MESSAGES.DELETE_SUCCESS);
      if (filteredDiscounts?.length === 1 && page > 1) setPage(page - 1);
    },
    onError: () => toast.error(DISCOUNT_MESSAGES.DELETE_ERROR),
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: ({ discountIds, isActive }: { discountIds: string[]; isActive: boolean }) =>
      bulkUpdateDiscounts(discountIds, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
      setSelectedDiscounts([]);
      toast.success(DISCOUNT_MESSAGES.BULK_UPDATE_SUCCESS);
    },
    onError: () => toast.error(DISCOUNT_MESSAGES.BULK_UPDATE_ERROR),
  });

  const validateDiscount = (discount: Partial<IDiscount>): boolean => {
    if (!discount.code || discount.code.trim() === "") {
      toast.error(DISCOUNT_MESSAGES.CODE_REQUIRED);
      return false;
    }
    if ((discount.discountValue ?? 0) <= 0 || isNaN(discount.discountValue ?? 0)) {
      toast.error(DISCOUNT_MESSAGES.VALUE_POSITIVE);
      return false;
    }
    if (discount.minOrderValue && discount.minOrderValue < 0) {
      toast.error(DISCOUNT_MESSAGES.MIN_ORDER_NEGATIVE);
      return false;
    }
    if (discount.maxDiscountAmount && discount.maxDiscountAmount < 0) {
      toast.error(DISCOUNT_MESSAGES.MAX_DISCOUNT_NEGATIVE);
      return false;
    }
    if (!discount.startDate) {
      toast.error(DISCOUNT_MESSAGES.START_DATE_REQUIRED);
      return false;
    }
    if (discount.endDate && new Date(discount.endDate) < new Date(discount.startDate)) {
      toast.error(DISCOUNT_MESSAGES.END_DATE_INVALID);
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

  const handleSelectDiscount = (discountId: string | string[]) => {
    setSelectedDiscounts((prev) =>
      Array.isArray(discountId)
        ? discountId
        : prev.includes(discountId)
        ? prev.filter((id) => id !== discountId)
        : [...prev, discountId]
    );
  };

  const toggleRowExpansion = (discountId: string) => {
    setExpandedRows((prev) =>
      prev.includes(discountId) ? prev.filter((id) => id !== discountId) : [...prev, discountId]
    );
  };

  if (!token || role !== "admin") {
    if (!token) navigate("/auth");
    else if (role !== "admin") {
      toast.error(DISCOUNT_MESSAGES.ADMIN_REQUIRED);
      navigate("/app/home");
    }
    return { token: null, role: null }; // Early return for invalid states
  }

  return {
    token,
    role,
    discountsData,
    isLoading,
    error,
    productsData,
    productsLoading,
    editingDiscount,
    setEditingDiscount,
    newDiscount,
    setNewDiscount,
    page,
    setPage,
    productsPage,
    setProductsPage,
    selectedDiscounts,
    setSelectedDiscounts,
    filterStatus,
    setFilterStatus,
    expandedRows,
    toggleRowExpansion,
    createMutation,
    updateMutation,
    deleteMutation,
    bulkUpdateMutation,
    handleAddDiscount,
    handleEdit,
    handleSave,
    handleSelectDiscount,
    limit,
  };
};