import { useQuery } from "@tanstack/react-query";
import { getUserOrders } from "../api/orderApi";
import { jwtDecode } from "jwt-decode";
import { Order } from "../types/types";

export const useOrderData = () => {
  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode<{ id: string }>(token).id : "";

  const { data: orders, isLoading, error } = useQuery<Order[]>({
    queryKey: ["orders", userId],
    queryFn: getUserOrders,
    enabled: !!userId,
  });

  return {
    orders: orders || [],
    isLoading,
    error,
  };
};