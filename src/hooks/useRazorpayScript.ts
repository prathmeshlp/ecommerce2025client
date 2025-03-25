import { useEffect, useState } from "react";
import { toast } from "react-toastify"; 
import { CHECKOUT_MESSAGES } from "../constants/checkoutConstants";


export const useRazorpayScript = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      toast.error(CHECKOUT_MESSAGES.SCRIPT_ERROR);
      setScriptLoaded(false);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return scriptLoaded;
};