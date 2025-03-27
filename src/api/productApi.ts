import { api } from "./api";
import { API_CONSTANTS } from "./constants";
import { Product } from "../types/types";

export const getProducts = () =>
  api.get(API_CONSTANTS.ENDPOINTS.PRODUCTS.LIST).then((res) => res.data);

export const getUniqueCategories = () =>
  api.get(API_CONSTANTS.ENDPOINTS.PRODUCTS.CATEGORIES).then((res) => res.data);


export const getReviews = (productId: string) =>
  api.get(API_CONSTANTS.ENDPOINTS.PRODUCTS.REVIEWS.replace(":productId", productId)).then((res) => res.data);

export const addReview = (productId: string, data: { userId: string; rating: number; comment: string }) =>
  api
    .post(API_CONSTANTS.ENDPOINTS.PRODUCTS.REVIEWS.replace(":productId", productId), data)
    .then((res) => res.data);

export const validateDiscount = (code: string, productIds: string[], subtotal: number, items: Product[]) =>
  api
    .post(API_CONSTANTS.ENDPOINTS.PRODUCTS.VALIDATE_DISCOUNT, { code, productIds, subtotal, items })
    .then((res) => res.data);