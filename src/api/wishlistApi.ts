import { api } from "./api";
import { API_CONSTANTS } from "./constants";

export const getWishlist = (userId: string) =>
  api.get(API_CONSTANTS.ENDPOINTS.WISHLIST.GET.replace(":userId", userId)).then((res) => res.data);

export const addToWishlist = (userId: string, productId: string) =>
  api.post(API_CONSTANTS.ENDPOINTS.WISHLIST.ADD, { userId, productId }).then((res) => res.data);

export const removeFromWishlist = (userId: string, productId: string) =>
  api.post(API_CONSTANTS.ENDPOINTS.WISHLIST.REMOVE, { userId, productId }).then((res) => res.data);