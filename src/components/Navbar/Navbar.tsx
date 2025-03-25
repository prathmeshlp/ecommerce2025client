import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { PuffLoader } from "react-spinners";
import { useNavbarData } from "../../hooks/useNavbarData";
import { NavItem } from "./NavItem";
import { AdminMenu } from "./AdminMenu";
import { NAV_ITEMS, NAV_CLASSES, NAVBAR_MESSAGES, NAV_ICONS } from "../../constants/navbarConstants";

export const Navbar: React.FC = () => {
  const {
    cartCount,
    role,
    wishlist,
    isLoading,
    isAdminMenuOpen,
    setIsAdminMenuOpen,
    logoutMutation,
    handleLogout,
  } = useNavbarData();

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <PuffLoader />
      </div>
    );
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={NAV_CLASSES.CONTAINER}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/app/home" className="text-2xl font-bold flex items-center space-x-2" aria-label="E-Shop Home">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {NAVBAR_MESSAGES.TITLE}
          </motion.span>
        </Link>
        <div className="flex space-x-6 items-center">
          {NAV_ITEMS.map((item, index) => (
            <NavItem
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
              badgeCount={
                item.label === "Cart" ? cartCount : item.label === "Wishlist" ? wishlist?.length : undefined
              }
              customIndex={index}
            />
          ))}
          {role === "admin" && (
            <AdminMenu isOpen={isAdminMenuOpen} toggleMenu={() => setIsAdminMenuOpen(!isAdminMenuOpen)} />
          )}
          <motion.div
            custom={6}
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0, transition: { delay: 6 * 0.1, duration: 0.3 } },
            }}
            initial="hidden"
            animate="visible"
          >
            <button
              onClick={handleLogout}
              className={twMerge(NAV_CLASSES.LOGOUT_BUTTON, logoutMutation.isPending && "opacity-50")}
              disabled={logoutMutation.isPending}
              aria-label="Logout"
            >
              <NAV_ICONS.LOGOUT className="mr-1" />
              {logoutMutation.isPending ? NAVBAR_MESSAGES.LOADING : NAVBAR_MESSAGES.LOGOUT}
            </button>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;