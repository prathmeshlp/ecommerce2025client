import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, updateOrder, deleteOrder, bulkUpdateOrders } from "../api/api";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useDebounce from "./useDebounce";
import { Order, OrdersResponse } from "../types/types";
import { ORDER_MESSAGES } from "../constants/orderManagementConstants";

export const useOrderManagementData = () => {
  const token = localStorage.getItem("token");
  const role = token ? jwtDecode<{ role: string }>(token).role : "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<"update" | "delete" | null>(null);
  const [bulkStatus, setBulkStatus] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const limit = 10;

  const { data: ordersData, isLoading, error } = useQuery<OrdersResponse>({
    queryKey: ["orders", page, paymentStatusFilter, debouncedSearchQuery],
    queryFn: () => getOrders(page, limit, paymentStatusFilter, debouncedSearchQuery),
    enabled: !!token && role === "admin",
  });

  const updateMutation = useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: { paymentStatus: string } }) =>
      updateOrder(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success(ORDER_MESSAGES.UPDATE_SUCCESS);
      setEditingOrder(null);
    },
    onError: () => toast.error(ORDER_MESSAGES.UPDATE_ERROR),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success(ORDER_MESSAGES.DELETE_SUCCESS);
      if (ordersData?.orders.length === 1 && page > 1) setPage(page - 1);
    },
    onError: () => toast.error(ORDER_MESSAGES.DELETE_ERROR),
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: ({ orderIds, action, paymentStatus }: { orderIds: string[]; action: "update" | "delete"; paymentStatus?: string }) =>
      bulkUpdateOrders(orderIds, action, paymentStatus),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setSelectedOrders([]);
      setIsBulkModalOpen(false);
      toast.success(data.message || ORDER_MESSAGES.BULK_SUCCESS);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || ORDER_MESSAGES.BULK_ERROR;
      toast.error(errorMessage);
    },
  });

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
  };

  const handleSave = () => {
    if (editingOrder) {
      updateMutation.mutate({
        orderId: editingOrder._id,
        data: { paymentStatus: editingOrder.paymentStatus },
      });
    }
  };

  const toggleDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleSelectOrder = (orderId: string | string[]) => {
    setSelectedOrders((prev) =>
      Array.isArray(orderId)
        ? orderId
        : prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleBulkAction = () => {
    if (selectedOrders.length === 0) {
      toast.error(ORDER_MESSAGES.NO_ORDERS_SELECTED);
      return;
    }
    if (bulkAction === "update" && !bulkStatus) {
      toast.error(ORDER_MESSAGES.NO_STATUS_SELECTED);
      return;
    }
    bulkUpdateMutation.mutate({
      orderIds: selectedOrders,
      action: bulkAction!,
      paymentStatus: bulkAction === "update" ? bulkStatus : undefined,
    });
  };

  if (!token || role !== "admin") {
    if (!token) navigate("/auth");
    else if (role !== "admin") {
      toast.error(ORDER_MESSAGES.ADMIN_REQUIRED);
      navigate("/app/home");
    }
    return { token: null, role: null };
  }

  return {
    token,
    role,
    ordersData,
    isLoading,
    error,
    editingOrder,
    setEditingOrder,
    expandedOrderId,
    toggleDetails,
    page,
    setPage,
    paymentStatusFilter,
    setPaymentStatusFilter,
    searchQuery,
    setSearchQuery,
    selectedOrders,
    handleSelectOrder,
    isBulkModalOpen,
    setIsBulkModalOpen,
    bulkAction,
    setBulkAction,
    bulkStatus,
    setBulkStatus,
    handleEdit,
    handleSave,
    handleBulkAction,
    updateMutation,
    deleteMutation,
    bulkUpdateMutation,
    limit,
  };
};