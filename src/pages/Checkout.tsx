import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useMutation } from "@tanstack/react-query";
import { createOrder, verifyPayment } from "../api/api";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import useCustomFormik from "../hooks/useCustomFormik";
import * as Yup from "yup";
import { clearCart } from "../redux/cartSlice";
import { useDispatch } from "react-redux";
import { ShippingAddress } from "../types/types";

// Extend the Window interface to include Razorpay
declare global {
  interface Window {
    Razorpay?: any;
  }
}

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

interface OrderResponse {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  key: string;
}

const Checkout: React.FC = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const cartItems = useSelector((state: RootState) => state.cart.items) as CartItem[];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { appliedDiscount, cartItems: passedCartItems } = (location.state as {
    appliedDiscount?: AppliedDiscount;
    cartItems?: CartItem[];
  }) || {};
  const itemsToDisplay = passedCartItems || cartItems;

  const subtotal = itemsToDisplay.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = appliedDiscount ? appliedDiscount.newSubtotal : subtotal;
console.log(appliedDiscount,"appileddis")
  
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      console.log("Razorpay script loaded");
      setScriptLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      toast.error("Failed to load payment gateway.");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const formik = useCustomFormik({
    initialValues: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "India",
    },
    validationSchema: Yup.object({
      street: Yup.string().required("Required"),
      city: Yup.string().required("Required"),
      state: Yup.string().required("Required"),
      zip: Yup.string().required("Required"),
      country: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      handleCheckout(values);
    },
  });

  const orderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data: OrderResponse) => {
      console.log("Order created:", data);
      initiateRazorpayPayment(data);
    },
    onError: (error: any) => {
      console.error("Order creation error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to create order.");
    },
  });

  const verifyMutation = useMutation({
    mutationFn: verifyPayment,
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Order Placed Successfully!");
        dispatch(clearCart());
        navigate("/app/orders");
      } else {
        toast.error("Payment verification failed.");
      }
    },
    onError: () => toast.error("Payment verification error."),
  });

  const handleCheckout = (shippingAddress: typeof formik.values) => {
    if (itemsToDisplay.length === 0) {
      toast.error("Cart is empty!");
      return;
    }
    const payload = {
      items: itemsToDisplay,
      shippingAddress: shippingAddress as ShippingAddress,
      discountCode: appliedDiscount?.code,
    };
    console.log("Creating order with payload:", payload);
    orderMutation.mutate(payload);
  };

  const initiateRazorpayPayment = (data: OrderResponse) => {
    if (!window.Razorpay) {
      toast.error("Payment gateway not loaded.");
      return;
    }
    const options = {
      key: data.key,
      amount: data.amount,
      currency: "INR",
      name: "E-Shop",
      description: "Order Payment",
      order_id: data.razorpayOrderId,
      handler: (response: any) => {
        console.log("Payment response:", response);
        verifyMutation.mutate({
          orderId: data.orderId,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        });
      },
      prefill: {
        email: "customer@example.com",
      },
      theme: {
        color: "#3b82f6",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response: any) => {
      console.error("Payment failed:", response.error);
      toast.error("Payment failed: " + response.error.description);
    });
    rzp.open();
  };

  return (
    <div className="container mx-auto p-4 mt-16">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6 text-center"
      >
        Checkout
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {itemsToDisplay.map((item) => {
            const discountedPrice =
              appliedDiscount?.discountedItems.find((d) => d.productId === item.productId)?.discountedPrice ||
              item.price;
            return (
              <div key={item.productId} className="flex justify-between p-2 border-b">
                <span>
                  {item.name} (x{item.quantity})
                </span>
                {appliedDiscount ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400 text-sm line-through">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                    <span className="text-green-700 font-bold">
                      ₹{(discountedPrice * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ) : (
                  <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                )}
              </div>
            );
          })}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            {appliedDiscount && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({appliedDiscount.code}):</span>
                <span>-₹{appliedDiscount.discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-semibold">
              <span>Total:</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <input
                name="street"
                value={formik.values.street}
                onChange={formik.handleChange}
                placeholder="Street"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.street && typeof formik.errors.street === "string" && (
                <p className="text-red-500 text-sm">{formik.errors.street}</p>
              )}
            </div>
            <div>
              <input
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                placeholder="City"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.city && typeof formik.errors.city === "string" && (
                <p className="text-red-500 text-sm">{formik.errors.city}</p>
              )}
            </div>
            <div>
              <input
                name="state"
                value={formik.values.state}
                onChange={formik.handleChange}
                placeholder="State"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.state && typeof formik.errors.state === "string" && (
                <p className="text-red-500 text-sm">{formik.errors.state}</p>
              )}
            </div>
            <div>
              <input
                name="zip"
                value={formik.values.zip}
                onChange={formik.handleChange}
                placeholder="Zip"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.zip && typeof formik.errors.zip === "string" && (
                <p className="text-red-500 text-sm">{formik.errors.zip}</p>
              )}
            </div>
            <div>
              <input
                name="country"
                value={formik.values.country}
                onChange={formik.handleChange}
                placeholder="Country"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.country && typeof formik.errors.country === "string" && (
                <p className="text-red-500 text-sm">{formik.errors.country}</p>
              )}
            </div>
            <motion.button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={orderMutation.isPending || !scriptLoaded}
            >
              {orderMutation.isPending ? "Processing..." : "Pay Now"}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;