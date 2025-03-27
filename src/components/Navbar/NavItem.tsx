import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IconType } from "react-icons";
import { NAV_CLASSES } from "../../constants/navbarConstants";

interface NavItemProps {
  to: string;
  label: string;
  icon: IconType;
  badgeCount?: number| null;
  customIndex: number;
}

export const NavItem: React.FC<NavItemProps> = ({
  to,
  label,
  icon: Icon,
  badgeCount,
  customIndex,
}) => {
  // console.log(`${label} badgeCount:`, badgeCount);
    const navItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  return (
    <motion.div
      custom={customIndex}
      variants={navItemVariants}
      initial="hidden"
      animate="visible"
    >
      <Link to={to} className={NAV_CLASSES.LINK} aria-label={label}>
        <Icon className="mr-1" />
        {label}
        {badgeCount && badgeCount > 0 &&   (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={NAV_CLASSES.BADGE}
          >
            {badgeCount}
          </motion.span>
        )}
      </Link>
    </motion.div>
  );
};
