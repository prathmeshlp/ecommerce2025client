import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../api/userApi";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ApiResponse, IUser, UsersData } from "../types/types";
import { USER_MESSAGES } from "../constants/userManagementConstants";
import { deleteUserAdmin, getUsersAdmin } from "../api/adminApi";
import { getToken } from "../utils/auth";

export const useUserManagementData = () => {
  const token = getToken();
  const role = token ? jwtDecode<{ role: string }>(token).role : "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState<IUser | null>(null);

  const { data: usersData, isLoading, error } = useQuery<ApiResponse<UsersData>>({
    queryKey: ["users"],
    queryFn: () => getUsersAdmin(),
    enabled: !!token && role === "admin",
  });

  const updateMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Partial<IUser> }) => updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(USER_MESSAGES.UPDATE_SUCCESS);
      setEditingUser(null);
    },
    onError: () => toast.error(USER_MESSAGES.UPDATE_ERROR),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUserAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(USER_MESSAGES.DELETE_SUCCESS);
    },
    onError: () => toast.error(USER_MESSAGES.DELETE_ERROR),
  });

  const handleEdit = (user: IUser) => {
    setEditingUser(user);
  };

  const handleSave = () => {
    if (editingUser) {
      updateMutation.mutate({ userId: editingUser._id, data: editingUser });
    }
  };

  if (!token || role !== "admin") {
    if (!token) navigate("/auth");
    else if (role !== "admin") {
      toast.error(USER_MESSAGES.ADMIN_REQUIRED);
      navigate("/app/home");
    }
    return { token: null, role: null };
  }

  return {
    token,
    role,
    usersData,
    isLoading,
    error,
    editingUser,
    setEditingUser,
    handleEdit,
    handleSave,
    updateMutation,
    deleteMutation,
  };
};


