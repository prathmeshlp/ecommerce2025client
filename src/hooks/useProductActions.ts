import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { addToCart } from "../redux/cartSlice";
import { toast } from "react-toastify";
import { ProductData } from "../types/types";
import { PRODUCT_MESSAGES } from "../constants/productConstants";

export const useProductActions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // console.log(location,"location")
  const product: ProductData | undefined = location.state?.product;
  console.log(product,"product")

  const discountedPrice = useMemo(() => {
    if (!product?.discount) return product?.price ?? 0;
    return product.discount.discountType === "percentage"
      ? Math.round(product.price * (1 - product.discount.discountValue / 100))
      : product.discount.discountType === "fixed"
      ? Math.round(product.price - product?.discount?.discountValue)
      : product.price;
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
      price: product.price,
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
      price: product.price,
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
