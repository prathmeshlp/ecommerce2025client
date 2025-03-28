import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "../api/adminApi";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getToken } from "../utils/auth";
import { ApiResponse, DashboardData } from "../types/types";
import { DASHBOARD_MESSAGES } from "../constants/dashboardConstants";

export const useAdminDashboardData = () => {
  const token = getToken();
  const navigate = useNavigate();

  let role: string | null = null;
  try {
    role = token ? jwtDecode<{ role: string }>(token).role : null;
  } catch (e) {
    console.error("Invalid token:", e);
    navigate("/auth");
  }

  const { data:response, isLoading, error } = useQuery<ApiResponse<DashboardData>>({
    queryKey: ["adminDashboard"],
    queryFn: getAdminDashboard,
    enabled: !!token && role === "admin",
  });

  if (!token) {
    navigate("/auth");
    return { token: null, data: null, isLoading: false, error: null };
  }

  if (role !== "admin") {
    toast.error(DASHBOARD_MESSAGES.ADMIN_REQUIRED);
    navigate("/app/home");
    return { token, data: null, isLoading: false, error: null };
  }

  return { token, data: response?.data || null, isLoading, error };
};