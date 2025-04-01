import React from "react";
import { motion } from "framer-motion";
import { OrderSummaryNew } from "../components/Checkout/OrderSummaryNew";
import { ShippingForm } from "../components/Checkout/ShippingForm";
import { CHECKOUT_MESSAGES } from "../constants/checkoutConstants";
import { useCheckoutData } from "../hooks/useCheckoutData";

const Checkout: React.FC = () => {
  const {
    cartItems,
    subtotal,
    total,
    appliedDiscounts,
    handleCheckout,
    orderMutation,
    scriptLoaded,
  } = useCheckoutData();

  if (cartItems?.length === 0) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-600">{CHECKOUT_MESSAGES.NO_ITEMS}</p>
        <button
          onClick={() => window.location.href = "/app/home"}
          className="mt-2 text-blue-500 underline"
          aria-label="Go to shop"
        >
          {CHECKOUT_MESSAGES.SHOP_NOW}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 mt-20">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6 text-center text-gray-800"
      >
        Checkout
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OrderSummaryNew
          items={cartItems!}
          subtotal={subtotal!}
          total={total!}
          appliedDiscounts={appliedDiscounts!}
        />
        <ShippingForm
          onSubmit={handleCheckout}
          isPending={orderMutation.isPending}
          scriptLoaded={scriptLoaded}
        />
      </div>
    </div>
  );
};  

export default Checkout;

