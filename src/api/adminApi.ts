import { api } from "./api";
import { API_CONSTANTS } from "./constants";
import { IDiscount, IUser, Product } from "../types/types";

export const getAdminDashboard = () =>
  api.get(API_CONSTANTS.ENDPOINTS.ADMIN.DASHBOARD).then((res) => res.data);

export const getUsersAdmin = (page: number = 1, limit: number = 10) =>
  api
    .get(API_CONSTANTS.ENDPOINTS.ADMIN.USERS, { params: { page, limit } })
    .then((res) => res.data);

export const updateUserAdmin = (userId: string, data: Partial<IUser>) =>
  api.put(`${API_CONSTANTS.ENDPOINTS.ADMIN.USERS}/${userId}`, data).then((res) => res.data);

export const deleteUserAdmin = (userId: string) =>
  api.delete(`${API_CONSTANTS.ENDPOINTS.ADMIN.USERS}/${userId}`).then((res) => res.data);

export const getProductsAdmin = (page: number = 1, limit: number = 10) =>
  api
    .get(API_CONSTANTS.ENDPOINTS.ADMIN.PRODUCTS, { params: { page, limit } })
    .then((res) => res.data);

export const createProductAdmin = (data: Omit<Product, "_id" | "createdAt">) =>
  api.post(API_CONSTANTS.ENDPOINTS.ADMIN.PRODUCTS, data).then((res) => res.data);

export const updateProductAdmin = (productId: string, data: Partial<Product>) =>
  api.put(`${API_CONSTANTS.ENDPOINTS.ADMIN.PRODUCTS}/${productId}`, data).then((res) => res.data);

export const deleteProductAdmin = (productId: string) =>
  api.delete(`${API_CONSTANTS.ENDPOINTS.ADMIN.PRODUCTS}/${productId}`).then((res) => res.data);

export const bulkUpdateProducts = (productIds: string[], stock: number) =>
  api.post(API_CONSTANTS.ENDPOINTS.ADMIN.BULK_PRODUCTS, { productIds, stock }).then((res) => res.data);

export const getOrders = (page: number = 1, limit: number = 10, paymentStatus?: string, search?: string) =>
  api
    .get(API_CONSTANTS.ENDPOINTS.ADMIN.ORDERS, { params: { page, limit, paymentStatus, search } })
    .then((res) => res.data);

export const updateOrder = (orderId: string, data: { paymentStatus: string }) =>
  api.put(`${API_CONSTANTS.ENDPOINTS.ADMIN.ORDERS}/${orderId}`, data).then((res) => res.data);

export const deleteOrder = (orderId: string) =>
  api.delete(`${API_CONSTANTS.ENDPOINTS.ADMIN.ORDERS}/${orderId}`).then((res) => res.data);

export const bulkUpdateOrders = (orderIds: string[], action: "update" | "delete", paymentStatus?: string) =>
  api
    .post(API_CONSTANTS.ENDPOINTS.ADMIN.BULK_ORDERS, { orderIds, action, paymentStatus })
    .then((res) => res.data);

export const getDiscounts = (page: number = 1, limit: number = 10) =>
  api
    .get(API_CONSTANTS.ENDPOINTS.ADMIN.DISCOUNTS, { params: { page, limit } })
    .then((res) => res.data);

export const createDiscount = (data: Partial<IDiscount>) =>
  api.post(API_CONSTANTS.ENDPOINTS.ADMIN.DISCOUNTS, data).then((res) => res.data);

export const updateDiscount = (discountId: string, data: Partial<IDiscount>) =>
  api.put(`${API_CONSTANTS.ENDPOINTS.ADMIN.DISCOUNTS}/${discountId}`, data).then((res) => res.data);

export const deleteDiscount = (discountId: string) =>
  api.delete(`${API_CONSTANTS.ENDPOINTS.ADMIN.DISCOUNTS}/${discountId}`).then((res) => res.data);

export const bulkUpdateDiscounts = (discountIds: string[], isActive: boolean) =>
  api.post(API_CONSTANTS.ENDPOINTS.ADMIN.BULK_DISCOUNTS, { discountIds, isActive }).then((res) => res.data);