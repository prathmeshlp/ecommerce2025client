import React from "react";
import { motion } from "framer-motion";
import { useCheckoutData } from "../hooks/useCheckoutData";
import { OrderSummaryNew } from "../components/OrderSummaryNew";
import { ShippingForm } from "../components/ShippingForm";
import { CHECKOUT_MESSAGES } from "../constants/checkoutConstants";

const Checkout: React.FC = () => {
  const {
    itemsToCheckout,
    subtotal,
    total,
    appliedDiscount,
    handleCheckout,
    orderMutation,
    scriptLoaded,
  } = useCheckoutData();

  if (itemsToCheckout.length === 0) {
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
    <div className="container mx-auto p-4 mt-16">
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
          items={itemsToCheckout}
          subtotal={subtotal}
          total={total}
          appliedDiscount={appliedDiscount ?? null}
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