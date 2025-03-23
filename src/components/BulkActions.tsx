import React from "react";
import { motion } from "framer-motion";
import { DISCOUNT_BUTTONS } from "../constants/discountConstants";

interface BulkActionsProps {
  selectedDiscounts: string[];
  onActivate: () => void;
  onDeactivate: () => void;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedDiscounts,
  onActivate,
  onDeactivate,
}) => (
  <div className="space-x-2">
    <motion.button
      onClick={onActivate}
      className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Activate ${selectedDiscounts.length} discounts`}
    >
      {DISCOUNT_BUTTONS.ACTIVATE} ({selectedDiscounts.length})
    </motion.button>
    <motion.button
      onClick={onDeactivate}
      className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Deactivate ${selectedDiscounts.length} discounts`}
    >
      {DISCOUNT_BUTTONS.DEACTIVATE} ({selectedDiscounts.length})
    </motion.button>
  </div>
);