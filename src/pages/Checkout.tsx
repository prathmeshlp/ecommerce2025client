import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useMutation } from "@tanstack/react-query";
import { createOrder, verifyPayment } from "../api/api";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useCustomFormik from "../hooks/useCustomFormik";
import * as Yup from "yup";
import { clearCart } from "../redux/cartSlice"; 
import { useDispatch } from "react-redux"; 

const Checkout: React.FC = () => {
    const [scriptLoaded, setScriptLoaded] = useState(false);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Add this
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

// Load Razorpay script dynamically
useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => toast.error("Failed to load Razorpay script.");
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
    onSuccess: (data) => {
      initiateRazorpayPayment(data);
    },
    onError: () => toast.error("Failed to create order."),
  });

  const verifyMutation = useMutation({
    mutationFn: verifyPayment,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(
          "Order Placed Successfully!"
        );
        dispatch(clearCart()); // Clear Cart
        navigate("/app/orders"); // Redirect to orders page
      } else {
        toast.error("Payment verification failed.");
      }
    },
    onError: () => toast.error("Payment verification error."),
  });

  const handleCheckout = (shippingAddress: typeof formik.values) => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty!");
      return;
    }
    orderMutation.mutate({ items: cartItems, shippingAddress });
  };

  const initiateRazorpayPayment = (data: { orderId: string; razorpayOrderId: string; amount: number; key: string }) => {
    const options = {
      key: data.key,
      amount: data.amount,
      currency: "INR",
      name: "E-Shop",
      description: "Order Payment",
      order_id: data.razorpayOrderId,
      handler: (response: any) => {
        verifyMutation.mutate({
          orderId: data.orderId,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        });
      },
      prefill: {
        email: "customer@example.com", // You can fetch from user profile
      },
      theme: {
        color: "#3b82f6",
      },
    };

    const rzp = new (window as any).Razorpay(options);
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
          {cartItems.map((item) => (
            <div key={item.productId} className="flex justify-between p-2 border-b">
              <span>{item.name} (x{item.quantity})</span>
              <span>₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="text-right mt-4">
            <p className="text-xl font-semibold">Total: ₹{total.toLocaleString()}</p>
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
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </div>
  );
};

export default Checkout;