// import React from "react";
// import { motion } from "framer-motion";
// import { useCartData } from "../hooks/useCartData";
// import { CartItemsList } from "../components/Cart/CartItemsList";
// import { OrderSummary } from "../components/Cart/OrderSummary";
// import { CART_MESSAGES } from "../constants/cartConstants";

// const Cart: React.FC = () => {
//   const {
//     cartItems,
//     subtotal,
//     total,
//     couponCode,
//     setCouponCode,
//     appliedDiscount,
//     applyDiscountMutation,
//     handleApplyDiscount,
//     handleRemoveDiscount,
//     handleRemoveItem,
//     handleUpdateQuantity,
//   } = useCartData();

//   return (
//     <div className="container mx-auto p-4 mt-16">
//       <motion.h1
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="text-3xl font-bold mb-6 text-center text-gray-800"
//       >
//         Your Cart
//       </motion.h1>
//       {cartItems.length > 0 ? (
//         <div className="flex justify-between items-start w-full">
//           <CartItemsList
//             cartItems={cartItems}
//             appliedDiscount={appliedDiscount}
//             onRemoveItem={handleRemoveItem}
//             onUpdateQuantity={handleUpdateQuantity}
//           />
//           <OrderSummary
//             subtotal={subtotal}
//             total={total}
//             couponCode={couponCode}
//             setCouponCode={setCouponCode}
//             appliedDiscount={appliedDiscount}
//             isApplyingDiscount={applyDiscountMutation.isPending}
//             onApplyDiscount={handleApplyDiscount}
//             onRemoveDiscount={handleRemoveDiscount}
//             cartItems={cartItems}
//           />
//         </div>
//       ) : (
//         <p className="text-center text-gray-600">{CART_MESSAGES.EMPTY_CART}</p>
//       )}
//     </div>
//   );
// };

// export default Cart;

import React from "react";
import { motion } from "framer-motion";
import { useCartData } from "../hooks/useCartData";
import { CartItemsList } from "../components/Cart/CartItemsList";
import { OrderSummary } from "../components/Cart/OrderSummary";
import { CART_MESSAGES } from "../constants/cartConstants";

const Cart: React.FC = () => {
  const {
    cartItems,
    subtotal,
    total,
    couponCode,
    setCouponCode,
    appliedDiscounts, // Now an array of AppliedDiscount
    applyDiscountMutation,
    handleApplyDiscount,
    handleRemoveDiscount,
    handleRemoveItem,
    handleUpdateQuantity,
  } = useCartData();

  return (
    <div className="container mx-auto p-4 mt-16">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6 text-center text-gray-800"
      >
        Your Cart
      </motion.h1>
      {cartItems.length > 0 ? (
        <div className="flex justify-between items-start w-full">
          <CartItemsList
            cartItems={cartItems}
            appliedDiscounts={appliedDiscounts} // Updated prop name to match array type
            onRemoveItem={handleRemoveItem}
            onUpdateQuantity={handleUpdateQuantity}
          />
          <OrderSummary
            subtotal={subtotal}
            total={total}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            appliedDiscounts={appliedDiscounts} // Updated to array
            isApplyingDiscount={applyDiscountMutation.isPending}
            onApplyDiscount={handleApplyDiscount}
            onRemoveDiscount={handleRemoveDiscount}
            cartItems={cartItems}
          />
        </div>
      ) : (
        <p className="text-center text-gray-600">{CART_MESSAGES.EMPTY_CART}</p>
      )}
    </div>
  );
};

export default Cart;