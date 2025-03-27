export interface ProductData {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
  avgRating?: number;
  discount?: {
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    discountedPrice: number;
  };
}

export interface PaginatedResponse {
  data: {
    products: ProductData[];
    totalProducts: number;
    currentPage: number;
    totalPages: number;
  };
}
export interface CarouselItem {
  image: string;
  title: string;
  subtitle: string;
}

export interface FilterState {
  selectedCategory: string | null;
  priceFilter: string;
  ratingFilter: string;
}

export interface Product {
  _id?: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  stock?: number;
  createdAt?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface AppliedDiscount {
  code: string;
  discountAmount: number;
  newSubtotal: number;
  discountedItems: { productId: string; discountedPrice: number }[];
}

export interface DiscountResponse {
  success: boolean;
  discount?: {
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    discountAmount: number;
    newSubtotal: number;
    discountedItems: { productId: string; discountedPrice: number }[];
  };
  error?: string;
}

export interface OrderResponse {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  key: string;
}

// Add Razorpay interface
interface Razorpay {
  new (options: RazorpayOptions): {
    open: () => void;
    on: (
      event: string,
      callback: (response: RazorpayPaymentResponse) => void
    ) => void;
  };
}

// Extend Window interface
declare global {
  interface Window {
    Razorpay?: Razorpay;
  }
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => void;
  prefill: { email: string };
  theme: { color: string };
}

export interface OrderItem {
  productId: { _id: string; name: string; price: number; image: string };
  quantity: number;
  price: number; // Price at order time (discounted if applicable)
}

export interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  discount?: { code: string; amount: number };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentStatus: "pending" | "completed" | "failed";
  createdAt: string;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
}

export interface Wishlist {
  data: {
    _id: string;
    userId: string;
    productId: Product;
  };
}

export interface IAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface IUser {
  _id: string;
  email: string;
  username: string;
  role: "user" | "admin";
  isBanned: boolean;
  address?: IAddress;
  createdAt: string;
  updatedAt: string;
}

export interface IDiscount {
  _id: string;
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  startDate: string; // ISO string
  endDate?: string; // ISO string
  isActive: boolean;
  applicableProducts?: { _id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  productId: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  addedAt: string;
  _id: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface User {
  email: string;
  username: string;
  address: Address;
}

export interface AuthFormData {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  data: { token: string };
}

export interface DashboardData {
  users: number;
  orders: number;
  revenue: number;
  products: number;
  recentOrders: {
    _id: string;
    userId: { email: string; username: string };
    total: number;
    paymentStatus: string;
    createdAt: string;
  }[];
  topProducts: { name: string; totalSold: number; totalRevenue: number }[];
  userGrowth: { month: string; count: number }[];
  revenueTrend: { month: string; total: number }[];
}

export interface DiscountsResponse {
  discounts: IDiscount[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface Order {
  _id: string;
  userId: { _id: string; email: string };
  items: OrderItem[];
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentStatus: "pending" | "completed" | "failed";
  razorpayOrderId?: string;
  paymentId?: string;
  createdAt: string;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface IUser {
  _id: string;
  email: string;
  username: string;
  role: "user" | "admin";
  isBanned: boolean;
  address?: IAddress;
  createdAt: string;
  updatedAt: string;
}

export interface UsersData {
  currentPage: number;
  total: number;
  totalPages: number;
  users: IUser[];
}
//create Order
export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface OrderRequest {
  items: CartItem[];
  shippingAddress: ShippingAddress;
  discountCode?: string; // Optional, based on your discount integration
}

export interface ApiResponse<T> {
  statusCode: number; // HTTP status code (e.g., 200, 201, 400, 401, etc.)
  success: boolean; // Indicates if the request was successful
  message: string; // Descriptive message (e.g., "User registered successfully")
  data?: T; // Generic data payload (varies by endpoint)
  errors?: string[]; // Array of error details (empty or populated for errors)
  errorCode?: string; // Unique error identifier (e.g., "USER_NOT_FOUND")
  metadata?: {
    timestamp: string; // ISO timestamp (e.g., "2025-03-26T10:00:00Z")
    requestId: string; // Unique request identifier (e.g., UUID)
  };
}

export type Categories = {
  data: string[];
};
