import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { useMutation } from "@tanstack/react-query";
import { createOrder, verifyPayment } from "../api/api";
import { useNavigate, useLocation } from "react-router-dom";
import { clearCart } from "../redux/cartSlice";
import { toast } from "react-hot-toast";
import {
  CartItem,
  AppliedDiscount,
  OrderResponse,
  RazorpayOptions,
  RazorpayPaymentResponse,
  ShippingAddress,
} from "../types/types";
import { CHECKOUT_MESSAGES } from "../constants/checkoutConstants";
import { useRazorpayScript } from "./useRazorpayScript";

export const useCheckoutData = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items) as CartItem[];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { appliedDiscount, buyNowItem } = (location.state as {
    appliedDiscount?: AppliedDiscount;
    buyNowItem?: CartItem;
  }) || {};

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const itemsToCheckout = buyNowItem ? [buyNowItem] : cartItems;

  const subtotal = useMemo(() => {
    return itemsToCheckout.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [itemsToCheckout]);

  const total = useMemo(() => {
    return appliedDiscount ? appliedDiscount.newSubtotal : subtotal;
  }, [subtotal, appliedDiscount]);

  const orderMutation = useMutation<OrderResponse, Error, { items: CartItem[]; shippingAddress: ShippingAddress; discountCode?: string }>({
    mutationFn: createOrder,
    onSuccess: (data) => initiateRazorpayPayment(data),
    onError: (error) => toast.error(error.message || CHECKOUT_MESSAGES.ORDER_ERROR),
  });

  const verifyMutation = useMutation({
    mutationFn: verifyPayment,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(CHECKOUT_MESSAGES.ORDER_SUCCESS);
        if (!buyNowItem) dispatch(clearCart());
        navigate("/app/orders");
      } else {
        toast.error("Payment verification failed.");
      }
    },
    onError: () => toast.error(CHECKOUT_MESSAGES.PAYMENT_ERROR),
  });

  const initiateRazorpayPayment = (data: OrderResponse) => {
    if (!window.Razorpay) {
      toast.error(CHECKOUT_MESSAGES.SCRIPT_ERROR);
      return;
    }
    const options: RazorpayOptions = {
      key: data.key,
      amount: data.amount,
      currency: "INR",
      name: "E-Shop",
      description: "Order Payment",
      order_id: data.razorpayOrderId,
      handler: (response: RazorpayPaymentResponse) => {
        verifyMutation.mutate({
          orderId: data.orderId,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        });
      },
      prefill: { email: "customer@example.com" }, // Replace with user email if available
      theme: { color: "#3b82f6" },
    };

    const rzp = new window.Razorpay(options);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rzp.on("payment.failed", (response: any) => {
      toast.error(CHECKOUT_MESSAGES.PAYMENT_FAILED + response.error.description);
    });
    rzp.open();
  };

  const handleCheckout = (shippingAddress: ShippingAddress) => {
    const payload = {
      items: itemsToCheckout,
      shippingAddress,
      discountCode: appliedDiscount?.code,
    };
    orderMutation.mutate(payload);
  };

  return {
    itemsToCheckout,
    subtotal,
    total,
    appliedDiscount,
    handleCheckout,
    orderMutation,
    scriptLoaded: useRazorpayScript(),
  };
};