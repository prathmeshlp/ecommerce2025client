export interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category?: string; 
  stock?: number;
  createdAt?: string;
}
  
  export interface CartItem {
    productId: Product;
    quantity: number;
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