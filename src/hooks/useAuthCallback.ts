import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AUTH_MESSAGES } from "../constants/authConstants";

export const useAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      toast.success(AUTH_MESSAGES.GOOGLE_LOGIN_SUCCESS);
      navigate("/app/home");
    } else {
      toast.error(AUTH_MESSAGES.GOOGLE_LOGIN_ERROR);
      navigate("/");
    }
  }, [searchParams, navigate]);
};