import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { removeFromCart, updateQuantity } from "../redux/cartSlice";
import { motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { validateDiscount } from "../api/api";
import { toast } from "react-hot-toast";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface AppliedDiscount {
  code: string;
  discountAmount: number;
  newSubtotal: number;
  discountedItems: { productId: string; discountedPrice: number }[];
}

interface DiscountResponse {
  success: boolean;
  discount?: {
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    discountAmount: number;
    newSubtotal: number;
    discountedItems: { productId: string; discountedPrice: number }[];
  };
  error?: string;
}

const Cart: React.FC = () => {
  const cartItems = useSelector(
    (state: RootState) => state.cart.items
  ) as CartItem[];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] =
    useState<AppliedDiscount | null>(null);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = appliedDiscount ? appliedDiscount.newSubtotal : subtotal;

  const applyDiscountMutation = useMutation<DiscountResponse, Error>({
    mutationFn: () => {
      const productIds = cartItems.map((item) => item.productId);
      console.log("Sending discount validation request:", {
        couponCode,
        productIds,
        subtotal,
        cartItems,
      });
      return validateDiscount(couponCode, productIds, subtotal, cartItems);
    },
    onSuccess: (data) => {
      console.log("Discount validation response:", data);
      if (data.success && data.discount) {
        setAppliedDiscount({
          code: data.discount.code,
          discountAmount: data.discount.discountAmount,
          newSubtotal: data.discount.newSubtotal,
          discountedItems: data.discount.discountedItems,
        });
        toast.success("Discount applied successfully!");
      } else {
        toast.error(data.error || "Failed to apply discount.");
      }
    },
    onError: (error) => {
      console.error("Discount validation error:", error);
      toast.error(error.message || "Failed to apply discount.");
    },
    onSettled: () => {
      console.log("Discount mutation settled");
    },
  });

  const handleApplyDiscount = () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code.");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Cart is empty. Add items to apply a discount.");
      return;
    }
    applyDiscountMutation.mutate();
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setCouponCode("");
    toast.success("Discount removed.");
  };

  return (
    <div className="container mx-auto p-4 mt-16">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-center"
      >
        Your Cart
      </motion.h1>
      {cartItems.length > 0 ? (
        <>
          <div className="cart-container flex justify-between items-start  w-full">
            <div className="flexcontainer-1 flex flex-col items-center justify-center w-1/2 ">
              {cartItems.map((item) => {
                const discountedPrice =
                  appliedDiscount?.discountedItems.find(
                    (d) => d.productId === item.productId
                  )?.discountedPrice ?? item.price; // Use ?? to keep original price if not discounted
                return (
                  <motion.div
                    key={item.productId}
                    className="item-description p-4 bg-white rounded-lg shadow mb-4 w-full flex justify-between items-center "
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="descriptionbox-1 w-full flex flex-col justify-center items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      {appliedDiscount && discountedPrice !== item.price ? (
                        <div className="flex items-center space-x-2">
                          <p className="text-gray-400 text-sm line-through">
                            ₹{item.price.toLocaleString()}
                          </p>
                          <p className="text-green-700 font-bold">
                            ₹{discountedPrice.toLocaleString()}
                          </p>
                        </div>
                      ) : (
                        <p>₹{item.price.toLocaleString()}</p>
                      )}
                    </div>
                    <div className="descriptionbox-2 w-full flex justify-end gap-4">
                      <div className="flex items-center gap-3 space-x-3">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            dispatch(
                              updateQuantity({
                                productId: item.productId,
                                quantity: Number(e.target.value),
                              })
                            )
                          }
                          className="w-16 p-1 border rounded"
                        />
                        <button
                          onClick={() =>
                            dispatch(removeFromCart(item.productId))
                          }
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="flexcontainer-2 w-1/3 h-full">
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex space-x-2 mb-4">
                  <input
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                    placeholder="Enter Coupon Code If Applicable"
                    className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={
                      appliedDiscount !== null ||
                      applyDiscountMutation.isPending
                    }
                  />
                  {appliedDiscount ? (
                    <motion.button
                      onClick={handleRemoveDiscount}
                      className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Remove
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={handleApplyDiscount}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={applyDiscountMutation.isPending}
                    >
                      {applyDiscountMutation.isPending
                        ? "Applying..."
                        : "Apply"}
                    </motion.button>
                  )}
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between mb-2 text-green-600">
                    <span>Discount ({appliedDiscount.code}):</span>
                    <span>
                      -₹{appliedDiscount.discountAmount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-semibold">
                  <span>Total:</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <motion.button
                  onClick={() =>
                    navigate("/app/checkout", {
                      state: { appliedDiscount, cartItems },
                    })
                  }
                  className="mt-4 w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Proceed to Checkout
                </motion.button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
