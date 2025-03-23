import { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { removeFromCart, updateQuantity } from "../redux/cartSlice";
import { useMutation } from "@tanstack/react-query";
import { validateDiscount } from "../api/api";
import { toast } from "react-hot-toast"; // Switched to react-hot-toast for consistency
import { CartItem, AppliedDiscount, DiscountResponse } from "../types/types";
import { CART_MESSAGES } from "../constants/cartConstants";

export const useCartData = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items) as CartItem[];
  const dispatch = useDispatch();
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const total = useMemo(() => {
    return appliedDiscount ? appliedDiscount.newSubtotal : subtotal;
  }, [subtotal, appliedDiscount]);

  const applyDiscountMutation = useMutation<DiscountResponse, Error>({
    mutationFn: () => {
      const productIds = cartItems.map((item) => item.productId);
      return validateDiscount(couponCode, productIds, subtotal, cartItems);
    },
    onSuccess: (data) => {
      if (data.success && data.discount) {
        setAppliedDiscount({
          code: data.discount.code,
          discountAmount: data.discount.discountAmount,
          newSubtotal: data.discount.newSubtotal,
          discountedItems: data.discount.discountedItems,
        });
        toast.success(CART_MESSAGES.DISCOUNT_APPLIED);
      } else {
        toast.error(data.error || "Failed to apply discount.");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to apply discount.");
    },
  });

  const handleApplyDiscount = () => {
    if (!couponCode.trim()) {
      toast.error(CART_MESSAGES.NO_COUPON);
      return;
    }
    if (cartItems.length === 0) {
      toast.error(CART_MESSAGES.EMPTY_CART_DISCOUNT);
      return;
    }
    applyDiscountMutation.mutate();
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setCouponCode("");
    toast.success(CART_MESSAGES.DISCOUNT_REMOVED);
  };

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity }));
  };

  return {
    cartItems,
    subtotal,
    total,
    couponCode,
    setCouponCode,
    appliedDiscount,
    applyDiscountMutation,
    handleApplyDiscount,
    handleRemoveDiscount,
    handleRemoveItem,
    handleUpdateQuantity,
  };
};