import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const useRazorpayScript = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setLoaded(true);
      script.onerror = () => toast.error("Failed to load Razorpay script");
      document.body.appendChild(script);
    } else {
      setLoaded(true);
    }
  }, []);

  return loaded;
};