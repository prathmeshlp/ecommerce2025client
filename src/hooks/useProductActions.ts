import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { addToCart } from "../redux/cartSlice";
import { toast } from "react-toastify"; // Switched to react-hot-toast
import { ProductData } from "../types/types";
import { PRODUCT_MESSAGES } from "../constants/productConstants";

export const useProductActions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const product: ProductData | undefined = location.state?.product;

  const discountedPrice = useMemo(() => {
    if (!product?.discount) return product?.price ?? 0;
    return product.discount.discountType === "percentage"
      ? Math.round(product.price * (1 - product.discount.discountValue / 100))
      : product.price - product.discount.discountValue;
  }, [product]);

  const savings = useMemo(() => {
    if (!product?.discount) return 0;
    return Math.round(
      product.discount.discountType === "percentage"
        ? (product.price * product.discount.discountValue) / 100
        : product.discount.discountValue
    );
  }, [product]);

  const handleAddToCart = () => {
    if (!product || product.stock < 1) {
      toast.error(PRODUCT_MESSAGES.OUT_OF_STOCK);
      return;
    }
    const cartItem = {
      productId: product._id,
      name: product.name,
      price: discountedPrice,
      quantity: 1,
      image: product.image,
    };
    dispatch(addToCart(cartItem));
    toast.success(PRODUCT_MESSAGES.ADDED_TO_CART(product.name));
  };

  const handleBuyNow = () => {
    if (!product || product.stock < 1) {
      toast.error(PRODUCT_MESSAGES.OUT_OF_STOCK);
      return;
    }
    const cartItem = {
      productId: product._id,
      name: product.name,
      price: discountedPrice,
      quantity: 1,
      image: product.image,
    };
    dispatch(addToCart(cartItem));
    navigate("/app/checkout", { state: { buyNowItem: cartItem } });
    toast.success(PRODUCT_MESSAGES.BUY_NOW(product.name));
  };

  const handleGoBack = () => navigate(-1);

  return {
    product,
    discountedPrice,
    savings,
    handleAddToCart,
    handleBuyNow,
    handleGoBack,
  };
};