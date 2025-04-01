import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { RootState } from "../redux/store";
import { logoutUser } from "../api/userApi";
import { getWishlist } from "../api/wishlistApi";
import { ApiResponse, WishlistItem } from "../types/types";
import { NAVBAR_MESSAGES } from "../constants/navbarConstants";

export const useNavbarData = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [wishlistCount, setWishlistCount] = useState<number | undefined>(undefined);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = token ? jwtDecode<{ role: string }>(token).role : "";
  const userId = token ? jwtDecode<{ id: string }>(token).id : null;
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  const { data: wishlist, isLoading } = useQuery<ApiResponse<WishlistItem[]>>({
    queryKey: ["wishlist", userId],
    queryFn: () => getWishlist(userId!),
    enabled: !!userId,
  });

  useEffect(() => {
    if (wishlist) {
      setWishlistCount(wishlist?.data?.length);
    }
  }, [wishlist]);

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      localStorage.removeItem("token");
      toast.success(NAVBAR_MESSAGES.LOGOUT_SUCCESS);
      navigate("/");
    },
    onError: () => {
      toast.error(NAVBAR_MESSAGES.LOGOUT_ERROR);
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return {
    cartCount,
    role,
    wishlistCount,
    isLoading,
    isAdminMenuOpen,
    setIsAdminMenuOpen,
    logoutMutation,
    handleLogout,
  };
};
