import { api } from "./api";
import { API_CONSTANTS } from "./constants";
import { OrderRequest, OrderResponse } from "../types/types";

export const createOrder = (data: OrderRequest): Promise<OrderResponse> =>
  api.post(API_CONSTANTS.ENDPOINTS.ORDERS.CREATE, data).then((res) => res.data);

export const verifyPayment = (data: {
  orderId: string;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}) => api.post(API_CONSTANTS.ENDPOINTS.ORDERS.VERIFY, data).then((res) => res.data);

export const getUserOrders = () =>
  api.get(API_CONSTANTS.ENDPOINTS.ORDERS.USER_ORDERS).then((res) => res.data);