// import { useMemo, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "../redux/store";
// import { removeFromCart, updateQuantity } from "../redux/cartSlice";
// import { useMutation } from "@tanstack/react-query";
// import { validateDiscount } from "../api/productApi";
// import { toast } from "react-toastify";
// import {
//   CartItem,
//   AppliedDiscount,
//   DiscountResponse,
//   ApiResponse,
// } from "../types/types";
// import { CART_MESSAGES } from "../constants/cartConstants";

// export const useCartData = () => {
//   const cartItems = useSelector(
//     (state: RootState) => state.cart.items
//   ) as CartItem[];
//   const dispatch = useDispatch();
//   const [couponCode, setCouponCode] = useState("");
//   const [appliedDiscount, setAppliedDiscount] =
//     useState<AppliedDiscount | null>(null);

//   const subtotal = useMemo(() => {
//     return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
//   }, [cartItems]);

//   const total = useMemo(() => {
//     return appliedDiscount ? appliedDiscount.newSubtotal : subtotal;
//   }, [subtotal, appliedDiscount]);

//   const applyDiscountMutation = useMutation<
//     ApiResponse<DiscountResponse>,
//     Error
//   >({
//     mutationFn: () => {
//       const productIds = cartItems.map((item) => item.productId);
//       return validateDiscount(couponCode, productIds, subtotal, cartItems);
//     },
//     onSuccess: (response) => {
//       console.log(response, "data");
//       if (response?.data?.success && response?.data?.discount) {
//         setAppliedDiscount({
//           code: response?.data?.discount?.code,
//           discountType:response?.data?.discount?.discountType,
//           discountValue: response?.data?.discount?.discountValue,
//           discountAmount: response?.data?.discount?.discountAmount,
//           newSubtotal: response?.data?.discount?.newSubtotal,
//           discountedItems: response?.data?.discount?.discountedItems
//         })
//         toast.success(CART_MESSAGES.DISCOUNT_APPLIED);
//       } else {
//         toast.error(response?.message || "Failed to apply discount.");
//       }
//     },
//     onError: (error) => {
//       toast.error(error.message || "Failed to apply discount.");
//     },
//   });

//   const handleApplyDiscount = () => {
//     if (!couponCode.trim()) {
//       toast.error(CART_MESSAGES.NO_COUPON);
//       return;
//     }
//     if (cartItems.length === 0) {
//       toast.error(CART_MESSAGES.EMPTY_CART_DISCOUNT);
//       return;
//     }
//     applyDiscountMutation.mutate();
//   };

//   const handleRemoveDiscount = () => {
//     setAppliedDiscount(null);
//     setCouponCode("");
//     toast.success(CART_MESSAGES.DISCOUNT_REMOVED);
//   };

//   const handleRemoveItem = (productId: string) => {
//     dispatch(removeFromCart(productId));
//   };

//   const handleUpdateQuantity = (productId: string, quantity: number) => {
//     dispatch(updateQuantity({ productId, quantity }));
//   };

//   return {
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
//   };
// };

// src/hooks/useCartData.ts
import { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { removeFromCart, updateQuantity } from "../redux/cartSlice";
import { useMutation } from "@tanstack/react-query";
import { validateDiscount } from "../api/productApi";
import { toast } from "react-toastify";
import { CartItem, AppliedDiscount, DiscountResponse, ApiResponse } from "../types/types";
import { CART_MESSAGES } from "../constants/cartConstants";

export const useCartData = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items) as CartItem[];
  const dispatch = useDispatch();
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscounts, setAppliedDiscounts] = useState<AppliedDiscount[]>([]); // Array for multiple discounts

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);


  // const flatappliedDiscounts = appliedDiscounts.flatMap((d)=>d.discountedItems);
  // console.log(flatappliedDiscounts,"flatappliedDiscounts")

  const total = useMemo(() => {
    let totalSum = 0;
    cartItems.forEach((item) => {
      const discount = appliedDiscounts
        .flatMap((d) => d.discountedItems)
        .find((di) => di.productId === item.productId);
        console.log(discount,"discpount")
      const price = discount ? discount.discountedPrice : item.price;
      totalSum += price * item.quantity;
    });
    return totalSum;
  }, [cartItems, appliedDiscounts]);
// console.log(total,"total")

  const applyDiscountMutation = useMutation<ApiResponse<DiscountResponse>, Error>({
    mutationFn: () => {
      const productIds = cartItems.map((item) => item.productId);
      return validateDiscount(couponCode, productIds, subtotal, cartItems);
    },
    onSuccess: (response) => {
      if (response?.data?.success && response?.data?.discount) {
        const newDiscount = response.data.discount.discountedItems;
        // console.log(newDiscount,"newDiscount")
        // // Check if this coupon code is already applied
        // if (appliedDiscounts.some((d) => d.code === newDiscount.code)) {
        //   toast.error("This coupon has already been applied.");
        //   return;
        // }
        // // Filter out items already discounted by another coupon
        // const alreadyDiscountedIds = appliedDiscounts.flatMap((d) =>
        //   d.discountedItems.map((di) => di.productId)
        // );
        // const applicableItems = newDiscount.discountedItems.filter(
        //   (di) => !alreadyDiscountedIds.includes(di.productId)
        // );
        // if (applicableItems.length === 0) {
        //   toast.error("No additional items are eligible for this discount.");
        //   return;
        // }
        // Calculate discount amount on frontend
        const discountAmount = newDiscount.reduce((sum, di) => {
          const item = cartItems.find((i) => i.productId === di.productId);
          const originalPrice = item?.price || 0;
          return sum + (originalPrice - di.discountedPrice) * (item?.quantity || 1);
        }, 0);
        setAppliedDiscounts([
          ...appliedDiscounts,
          {
            code: response?.data?.discount?.code,
            discountType: response?.data?.discount?.discountType,
            discountValue: response?.data?.discount?.discountValue,
            discountAmount,
            discountedItems:response?.data?.discount?.discountedItems,
          },
        ]);
        setCouponCode("");
        toast.success(CART_MESSAGES.DISCOUNT_APPLIED);
      } else {
        toast.error(response?.message || "Failed to apply discount.");
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

  const handleRemoveDiscount = (code: string) => {
    setAppliedDiscounts(appliedDiscounts.filter((d) => d.code !== code));
    toast.success(CART_MESSAGES.DISCOUNT_REMOVED);
  };

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
    // Remove any discount applied to this item
    setAppliedDiscounts(
      appliedDiscounts.map((d) => ({
        ...d,
        discountedItems: d.discountedItems.filter((di) => di.productId !== productId),
      })).filter((d) => d.discountedItems.length > 0)
    );
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity }));
    // Recalculate discount amount for affected items
    setAppliedDiscounts(
      appliedDiscounts.map((d) => {
        const affectedItem = d.discountedItems.find((di) => di.productId === productId);
        if (affectedItem) {
          const item = cartItems.find((i) => i.productId === productId);
          const originalPrice = item?.price || 0;
          const discountPerItem = originalPrice - affectedItem.discountedPrice; // Calculate once
          return {
            ...d,
            discountAmount: d.discountedItems.reduce((sum, di) => {
              const cartItem = cartItems.find((i) => i.productId === di.productId);
              const itemDiscount = di.productId === productId
                ? discountPerItem // Use for updated item
                : (cartItem?.price || 0) - di.discountedPrice; // Use original calc for others
              return sum + itemDiscount * (cartItem?.quantity || 1);
            }, 0),
          };
        }
        return d;
      })
    );
  };

  return {
    cartItems,
    subtotal,
    total,
    couponCode,
    setCouponCode,
    appliedDiscounts, // Now an array
    applyDiscountMutation,
    handleApplyDiscount,
    handleRemoveDiscount,
    handleRemoveItem,
    handleUpdateQuantity,
  };
};