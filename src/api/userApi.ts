import { api } from "./api";
import { API_CONSTANTS } from "./constants";
import { IUser } from "../types/types";

export const loginUser = (credentials: { email: string; password: string }) =>
  api.post(API_CONSTANTS.ENDPOINTS.USERS.LOGIN, credentials).then((res) => res.data);

export const registerUser = (credentials: { email: string; username: string; password: string }) =>
  api.post(API_CONSTANTS.ENDPOINTS.USERS.REGISTER, credentials).then((res) => res.data);

export const logoutUser = () =>
  api.post(API_CONSTANTS.ENDPOINTS.USERS.LOGOUT).then((res) => res.data);

export const getUser = (userId: string) =>
  api.get(`${API_CONSTANTS.ENDPOINTS.USERS.USER}/${userId}`).then((res) => res.data);

export const updateUser = (userId: string, data: Partial<IUser>) =>
  api.put(`${API_CONSTANTS.ENDPOINTS.USERS.USER}/${userId}`, data).then((res) => res.data);