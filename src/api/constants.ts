export const API_CONSTANTS = {
    BASE_URL: import.meta.env.VITE_API_URL_LOCAL || "http://localhost:5000",
    ENDPOINTS: {
      ADMIN: {
        DASHBOARD: "/admin/dashboard",
        USERS: "/admin/users",
        PRODUCTS: "/admin/products",
        ORDERS: "/admin/orders",
        DISCOUNTS: "/admin/discounts",
        BULK_ORDERS: "/admin/orders/bulk",
        BULK_PRODUCTS: "/admin/products/bulk",
        BULK_DISCOUNTS: "/admin/discounts/bulk",
      },
      USERS: {
        LOGIN: "/users/login",
        REGISTER: "/users/register",
        LOGOUT: "/users/logout",
        USER: "/users",
      },
      PRODUCTS: {
        LIST: "/products",
        CATEGORIES: "/products/categories",
        REVIEWS: "/products/:productId/reviews",
        VALIDATE_DISCOUNT: "/products/validate",
      },
      WISHLIST: {
        GET: "/wishlist/:userId",
        ADD: "/wishlist/add",
        REMOVE: "/wishlist/remove",
      },
      ORDERS: {
        CREATE: "/orders/create",
        VERIFY: "/orders/verify",
        USER_ORDERS: "/orders/user",
      },
    },
    TIMEOUT: 10000, // Optional: Add timeout for requests
  };