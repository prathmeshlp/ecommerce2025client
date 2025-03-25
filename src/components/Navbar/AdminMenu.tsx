import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { NAV_CLASSES, ADMIN_MENU_ITEMS, NAV_ICONS } from "../../constants/navbarConstants";

interface AdminMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

export const AdminMenu: React.FC<AdminMenuProps> = ({ isOpen, toggleMenu }) => {
  const adminMenuVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2 } },
  };

  return (
    <div className="relative">
      <motion.button
        custom={5}
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible: { opacity: 1, y: 0, transition: { delay: 5 * 0.1, duration: 0.3 } },
        }}
        initial="hidden"
        animate="visible"
        onClick={toggleMenu}
        className={NAV_CLASSES.ADMIN_BUTTON}
        aria-label="Toggle admin menu"
      >
        <NAV_ICONS.ADMIN className="mr-1" /> Admin
      </motion.button>
      {isOpen && (
        <motion.div
          variants={adminMenuVariants}
          initial="hidden"
          animate="visible"
          className={NAV_CLASSES.ADMIN_MENU}
        >
          {ADMIN_MENU_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={NAV_CLASSES.ADMIN_ITEM}
              onClick={toggleMenu}
              aria-label={item.label}
            >
              <item.icon className="mr-2 text-blue-600" />
              {item.label}
            </Link>
          ))}
        </motion.div>
      )}
    </div>
  );
};