import { useQuery } from "@tanstack/react-query";
import { getUserOrders } from "../api/orderApi";
import { jwtDecode } from "jwt-decode";
import { ApiResponse, Order } from "../types/types";
import { getToken } from "../utils/auth";

export const useOrderData = () => {
  const token = getToken();
  const userId = token ? jwtDecode<{ id: string }>(token).id : "";

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery<ApiResponse<Order[]>>({
    queryKey: ["orders", userId],
    queryFn: getUserOrders,
    enabled: !!userId,
  });


  return {
    orders: orders?.data || [],
    isLoading,
    error,
  };
};
