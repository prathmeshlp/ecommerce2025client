import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  FaShoppingCart,
  FaHome,
  FaList,
  FaHeart,
  FaSignOutAlt,
  FaChartBar,
  FaUser,
  FaBox,
  FaTag,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getWishlist, logoutUser } from "../api/api";
import { jwtDecode } from "jwt-decode";
import { WishlistItem } from "./Product";

const Navbar: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = token ? jwtDecode<{ role: string }>(token).role : "";
  const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;

  const { data: wishlist} = useQuery<WishlistItem[]>({
    queryKey: ["wishlist", userId],
    queryFn: () => getWishlist(userId!),
    enabled: !!userId,
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      localStorage.removeItem("token");
      toast.info("Logged out successfully!");
      navigate("/");
    },
    onError: () => {
      toast.error("Logout failed!");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-blue-600 text-white p-4 shadow-lg fixed w-full top-0 z-10"
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/app/home"
          className="text-2xl font-bold flex items-center space-x-2"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            E-Shop
          </motion.span>
        </Link>
        <div className="flex space-x-6 items-center">
          <motion.div
            custom={0}
            variants={navItemVariants}
            initial="hidden"
            animate="visible"
          >
            <Link
              to="/app/home"
              className="flex items-center hover:text-gray-200 transition-colors"
            >
              <FaHome className="mr-1" /> Home
            </Link>
          </motion.div>
          <motion.div
            custom={2}
            variants={navItemVariants}
            initial="hidden"
            animate="visible"
          >
            <Link
              to="/app/cart"
              className="flex items-center hover:text-gray-200 transition-colors"
            >
              <FaShoppingCart className="mr-1" />
              Cart
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>
          </motion.div>
          <motion.div
            custom={3}
            variants={navItemVariants}
            initial="hidden"
            animate="visible"
          >
            <Link
              to="/app/orders"
              className="flex items-center hover:text-gray-200 transition-colors"
            >
              <FaList className="mr-1" /> Orders
            </Link>
          </motion.div>
          <motion.div
            custom={4}
            variants={navItemVariants}
            initial="hidden"
            animate="visible"
          >
            <Link
              to="/app/wishlist"
              className="flex items-center hover:text-gray-200 transition-colors"
            >
              <FaHeart className="mr-1" /> Wishlist
              {wishlist && wishlist?.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs"
                >
                  {wishlist?.length}
                </motion.span>
              )}
            </Link>
          </motion.div>
          <motion.div
            custom={5}
            variants={navItemVariants}
            initial="hidden"
            animate="visible"
          >
            <Link
              to="/app/profile"
              className="flex items-center hover:text-gray-200 transition-colors"
            >
              <FaHeart className="mr-1" /> Profile
            </Link>
          </motion.div>

          {role === "admin" && (
            <>
              <motion.div
                custom={7}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
              >
                <Link
                  to="/app/admin/dashboard"
                  className="flex items-center hover:text-gray-200 transition-colors"
                >
                  <FaChartBar className="mr-1" /> Dashboard
                </Link>
              </motion.div>
              <motion.div
                custom={8}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
              >
                <Link
                  to="/app/admin/users"
                  className="flex items-center hover:text-gray-200 transition-colors"
                >
                  <FaUser className="mr-1" /> Users
                </Link>
              </motion.div>
              <motion.div
                custom={9}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
              >
                <Link
                  to="/app/admin/products"
                  className="flex items-center hover:text-gray-200 transition-colors"
                >
                  <FaBox className="mr-1" /> Products
                </Link>
              </motion.div>

              <motion.div
                custom={3}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
              >
                <Link
                  to="/app/admin/orders"
                  className="flex items-center hover:text-gray-200 transition-colors"
                >
                  <FaShoppingCart className="mr-1" /> Orders
                </Link>
              </motion.div>
              <motion.div
                custom={5}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
              >
                <Link
                  to="/app/admin/discounts"
                  className="flex items-center hover:text-gray-200 transition-colors"
                >
                  <FaTag className="mr-1" /> Discounts
                </Link>
              </motion.div>
            </>
          )}
          <motion.div
            custom={6}
            variants={navItemVariants}
            initial="hidden"
            animate="visible"
          >
            <button
              onClick={handleLogout}
              className={twMerge(
                "flex items-center bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition-colors"
              )}
              disabled={logoutMutation.isPending}
            >
              <FaSignOutAlt className="mr-1" />{" "}
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </button>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
