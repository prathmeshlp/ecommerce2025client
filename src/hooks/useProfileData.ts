import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUser, updateUser } from "../api/userApi";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // Switched to react-hot-toast
import { User, Address } from "../types/types";
import { PROFILE_MESSAGES } from "../constants/profileConstants";

export const useProfileData = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode<{ id: string }>(token).id : "";
  const navigate = useNavigate();

  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<User>) => updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      toast.success(PROFILE_MESSAGES.UPDATE_SUCCESS);
      navigate("/app/home");
    },
    onError: () => toast.error(PROFILE_MESSAGES.UPDATE_ERROR),
  });

  const handleUpdateProfile = (values: {
    email: string;
    username: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }) => {
    const newAddress: Address = {
      street: values.street,
      city: values.city,
      state: values.state,
      zip: values.zip,
      country: values.country,
    };
    updateProfileMutation.mutate({
      email: values.email,
      username: values.username,
      address: newAddress,
    });
  };

  return {
    token,
    user,
    isLoading,
    error,
    updateProfileMutation,
    handleUpdateProfile,
  };
};