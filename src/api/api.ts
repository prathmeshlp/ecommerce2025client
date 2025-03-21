import axios from "axios";
import { getToken } from "./auth";
// import { User } from "../pages/UserManagement";
import { IDiscount, IUser, OrderRequest, OrderResponse, Product } from "../types/types";

const apiUrl = import.meta.env.VITE_API_URL_LOCAL || "http://localhost:5000";

export const api = axios.create({
  baseURL: `${apiUrl}/api/`,
  withCredentials: true, //
});

api.interceptors.request.use((config) => {
  const currentToken = getToken();
  if (currentToken) {
    config.headers.Authorization = `Bearer ${currentToken}`;
  }
  return config;
});

//admin 
export const getAdminDashboard = () =>
  api.get("/admin/dashboard").then((res) => res.data);

export const getUsers = () => api.get("/admin/users").then((res) => res.data);

export const updateUser = (userId: string, data: Partial<IUser>) =>
  api.put(`/admin/users/${userId}`, data).then((res) => res.data);

export const deleteUser = (userId: string) => api.delete(`/admin/users/${userId}`).then((res) => res.data);

export const loginUser = (credentials: { email: string; password: string }) =>
  api.post("/users/login", credentials).then((res) => res.data);

export const registerUser = (credentials: { email: string,username:string; password: string }) =>
  api.post("/users/register", credentials).then((res) => res.data);

export const getProducts = ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) =>
  api.get("/products", { params: { page, limit } }).then((res) => res.data);

// export const getCategories = () => api.get("/categories").then((res) => res.data);
export const getUniqueCategories = () => api.get("/products/categories").then((res) => res.data);

export const getUser = (userId: string) =>
  api.get(`/users/${userId}`).then((res) => res.data);

export const getReviews = (productId: string) =>
  api.get(`/products/${productId}/reviews`).then((res) => res.data);

export const addReview = (productId: string, data: { userId: string; rating: number; comment: string }) =>
  api.post(`/products/${productId}/reviews`, data).then((res) => res.data);

export const logoutUser = () => api.post("/users/logout").then((res) => res.data);

export const getWishlist = (userId: string) =>
  api.get(`/wishlist/${userId}`).then((res) => res.data);

export const addToWishlist = (userId: string, productId: string) =>
  api.post("/wishlist/add", { userId, productId }).then((res) => res.data);

export const removeFromWishlist = (userId: string, productId: string) =>
  api.post("/wishlist/remove", { userId, productId }).then((res) => res.data);

//orders razorpary
export const createOrder = (data: OrderRequest): Promise<OrderResponse> =>
  api.post("/orders/create", data).then((res) => res.data);

export const verifyPayment = (data: {
  orderId: string;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}) => api.post("/orders/verify", data).then((res) => res.data);

export const getUserOrders = () => api.get("/orders/user").then((res) => res.data);

//admin products routes
export const getProductsAdmin = (page: number = 1, limit: number = 10) => api.get("/admin/products",{ params: { page, limit } }).then((res) => res.data);
export const createProductAdmin = (data: Omit<Product, "_id" | "createdAt">) => api.post("/admin/products", data).then((res) => res.data);
export const updateProductAdmin = (productId: string, data: Partial<Product>) =>
  api.put(`/admin/products/${productId}`, data).then((res) => res.data);
export const deleteProductAdmin = (productId: string) => api.delete(`/admin/products/${productId}`).then((res) => res.data);

//Orders
export const getOrders = (page: number = 1, limit: number = 10, paymentStatus?: string, search?: string) =>
  api.get("/admin/orders", { params: { page, limit, paymentStatus, search } }).then((res) => res.data);

export const bulkUpdateOrders = (orderIds: string[], action: "update" | "delete", paymentStatus?: string) =>
  api.post("/admin/orders/bulk", { orderIds, action, paymentStatus }).then((res) => res.data);

export const updateOrder = (orderId: string, data: { paymentStatus: string }) =>
  api.put(`/admin/orders/${orderId}`, data).then((res) => res.data);

export const deleteOrder = (orderId: string) =>
  api.delete(`/admin/orders/${orderId}`).then((res) => res.data);

//Admin Users Routes
export const getUsersAdmin = (page: number = 1, limit: number = 10) =>
  api.get("/admin/users", { params: { page, limit } }).then((res) => res.data);

export const updateUserAdmin = (userId: string, data: Partial<IUser>) =>
  api.put(`/admin/users/${userId}`, data).then((res) => res.data);

export const deleteUserAdmin = (userId: string) =>
  api.delete(`/admin/users/${userId}`).then((res) => res.data);

export const bulkUpdateProducts = (productIds: string[], stock: number) =>
  api.post("/admin/products/bulk", { productIds, stock }).then((res) => res.data);

//Discounts & Coupons
export const getDiscounts = (page: number = 1, limit: number = 10) =>
  api.get("/admin/discounts", { params: { page, limit } }).then((res) => res.data);

export const createDiscount = (data: Partial<IDiscount>) =>
  api.post("/admin/discounts", data).then((res) => res.data);

export const updateDiscount = (discountId: string, data: Partial<IDiscount>) =>
  api.put(`/admin/discounts/${discountId}`, data).then((res) => res.data);

export const deleteDiscount = (discountId: string) =>
  api.delete(`/admin/discounts/${discountId}`).then((res) => res.data);

export const bulkUpdateDiscounts = (discountIds: string[], isActive: boolean) =>
  api.post("/admin/discounts/bulk", { discountIds, isActive }).then((res) => res.data);

export const validateDiscount = (code: string, productIds: string[], subtotal: number,items: any[]) =>
  api.post("/products/validate", { code, productIds, subtotal,items }).then((res) => res.data);