export interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category?: string; 
  stock?: number;
  createdAt?: string;
}

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
  
  export interface CartItem {
    productId: string;
    quantity: number;
    name: string;
    price: number;
    image: string;
  }
  
  export interface Cart {
    _id: string;
    userId: string;
    items: CartItem[];
  }
  
  export interface OrderItem {
    productId: Product;
    quantity: number;
  }
  
  export interface Order {
    _id: string;
    userId: string;
    items: OrderItem[];
    total: number;
    status: string;
  }
  
  export interface Wishlist {
    _id: string;
    userId: string;
    productId: Product;
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
    discountCode?: string ; // Optional, based on your discount integration
  }
  
  export interface OrderResponse {
    orderId: string;
    razorpayOrderId: string;
    amount: number;
    key: string;
  }