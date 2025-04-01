import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWishlist, removeFromWishlist } from "../api/wishlistApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // Switched to react-hot-toast
import { ApiResponse, WishlistItem } from "../types/types";
import { WISHLIST_MESSAGES } from "../constants/wishlistConstants";

export const useWishlistData = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  let userId: string | null = null;
  try {
    userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;
  } catch (e) {
    console.error("Invalid token:", e);
    navigate("/");
  }

  const { data: wishlist, isLoading, error } = useQuery<ApiResponse<WishlistItem[]>>({
    queryKey: ["wishlist", userId],
    queryFn: () => getWishlist(userId!),
    enabled: !!userId,
  });

  console.log(wishlist)

  const removeMutation = useMutation({
    mutationFn: ({ userId, productId }: { userId: string; productId: string }) =>
      removeFromWishlist(userId, productId),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["wishlist", userId] });
      }
      toast.success(WISHLIST_MESSAGES.REMOVE_SUCCESS);
    },
    onError: () => toast.error(WISHLIST_MESSAGES.REMOVE_ERROR),
  });

  const handleRemove = (item: WishlistItem) => {
    if (!userId) return;
    const productId = item.productId ? item.productId._id : item._id;
    removeMutation.mutate({ userId, productId });
  };

  // const handleProductClick = (productId: string) => {
  //   navigate(`/app/product/${productId}`);
  // };

    const handleProductClick = (item: WishlistItem) => {
      navigate(`/app/product/${item?.productId?._id}`, { state: { item } });
    };

  return {
    userId,
    wishlist: wishlist?.data || [],
    isLoading,
    error,
    removeMutation,
    handleRemove,
    handleProductClick,
  };
};