import { FaShoppingCart, FaHome, FaList, FaHeart, FaSignOutAlt, FaChartBar, FaUser, FaBox, FaTag, FaCog } from "react-icons/fa";

export const NAVBAR_MESSAGES = {
  TITLE: "E-Shop",
  LOGOUT_SUCCESS: "Logged out successfully!",
  LOGOUT_ERROR: "Logout failed!",
  LOADING: "Logging out...",
  LOGOUT: "Logout",
};

export const NAV_ITEMS = [
  { to: "/app/home", label: "Home", icon: FaHome },
  { to: "/app/cart", label: "Cart", icon: FaShoppingCart },
  { to: "/app/orders", label: "Orders", icon: FaList },
  { to: "/app/wishlist", label: "Wishlist", icon: FaHeart },
  { to: "/app/profile", label: "Profile", icon: FaHeart }, // Note: Icon mismatch in original (FaHeart); adjust if needed
];

export const ADMIN_MENU_ITEMS = [
  { to: "/app/admin/dashboard", label: "Dashboard", icon: FaChartBar },
  { to: "/app/admin/users", label: "Users", icon: FaUser },
  { to: "/app/admin/products", label: "Products", icon: FaBox },
  { to: "/app/admin/orders", label: "Orders", icon: FaShoppingCart },
  { to: "/app/admin/discounts", label: "Discounts", icon: FaTag },
];

export const NAV_CLASSES = {
  CONTAINER: "bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg fixed w-full top-0 z-20",
  LINK: "flex items-center hover:text-gray-200 transition-colors",
  LOGOUT_BUTTON: "flex items-center bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600 transition-colors",
  ADMIN_BUTTON: "flex items-center bg-blue-700 px-3 py-1 rounded-lg hover:bg-blue-900 transition-colors",
  ADMIN_MENU: "absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl p-2 z-30 border border-gray-200",
  ADMIN_ITEM: "flex items-center p-2 hover:bg-gray-100 rounded transition-colors",
  BADGE: "ml-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs",
};

export const NAV_ICONS = {
  LOGOUT: FaSignOutAlt,
  ADMIN: FaCog,
};