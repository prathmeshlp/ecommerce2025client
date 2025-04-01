/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { createOrder, verifyPayment } from "../api/orderApi";
import { useNavigate, useLocation } from "react-router-dom";
import { clearCart } from "../redux/cartSlice";
import { toast } from "react-toastify";
import {
  CartItem,
  AppliedDiscount,
  OrderResponse,
  RazorpayOptions,
  RazorpayPaymentResponse,
  ShippingAddress,
  ApiResponse,
} from "../types/types";
import { CHECKOUT_MESSAGES } from "../constants/checkoutConstants";
import { useRazorpayScript } from "./useRazorpayScript";

export const useCheckoutData = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { appliedDiscounts, cartItems } =
    (location.state as {
      appliedDiscounts?: AppliedDiscount[];
      cartItems?: CartItem[];
    }) || {};

  const subtotal = useMemo(() => {
    return (
      cartItems?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0
    );
  }, [cartItems]);

  const getBestDiscountedPrice = (productId: string): number => {
    const discountsForItem = appliedDiscounts
      ?.flatMap((d) => d.discountedItems)
      .filter((di) => di.productId === productId);
    if (!discountsForItem || discountsForItem.length === 0) {
      const item = cartItems?.find((i) => i.productId === productId);
      return item ? item.price : 0;
    }
    return Math.min(...discountsForItem.map((di) => di.discountedPrice));
  };

  const total = useMemo(() => {
    return (
      cartItems?.reduce((sum, item) => {
        const bestPrice = getBestDiscountedPrice(item.productId);
        return sum + bestPrice * item.quantity;
      }, 0) || 0
    );
  }, [cartItems, appliedDiscounts]);

  console.log(useRazorpayScript());

  const orderMutation = useMutation<
    ApiResponse<OrderResponse>,
    Error,
    {
      items: CartItem[];
      shippingAddress: ShippingAddress;
      discountCode?: string[];
    }
  >({
    mutationFn: createOrder,
    onSuccess: (res) => {
      console.log("Order mutation success:", res);
      if (res.success && res.data) {
        initiateRazorpayPayment(res.data);
      } else {
        toast.error("Order created but invalid response data.");
      }
    },
    onError: (error) => {
      toast.error(error.message || CHECKOUT_MESSAGES.ORDER_ERROR);
    },
  });

  const verifyMutation = useMutation({
    mutationFn: verifyPayment,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(CHECKOUT_MESSAGES.ORDER_SUCCESS);
        if (cartItems) dispatch(clearCart());
        navigate("/app/orders");
      } else {
        toast.error("Payment verification failed.");
      }
    },
    onError: () => toast.error(CHECKOUT_MESSAGES.PAYMENT_ERROR),
  });

  const initiateRazorpayPayment = (data: OrderResponse) => {
    if (!useRazorpayScript || !window.Razorpay) {
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
      prefill: { email: "customer@example.com" },
      theme: { color: "#3b82f6" },
    };

    const rzp = new window.Razorpay(options);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rzp.on("payment.failed", (response: any) => {
      toast.error(
        CHECKOUT_MESSAGES.PAYMENT_FAILED + (response.error.description || "")
      );
    });
    rzp.open();
  };

  const handleCheckout = (shippingAddress: ShippingAddress) => {
    if (!cartItems || cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    const payload = {
      items: cartItems,
      shippingAddress,
      discountCode: appliedDiscounts?.map((item) => item.code) || [],
    };
    orderMutation.mutate(payload);
  };

  return {
    cartItems,
    subtotal,
    total,
    appliedDiscounts,
    handleCheckout,
    orderMutation,
    scriptLoaded: useRazorpayScript(),
  };
};
