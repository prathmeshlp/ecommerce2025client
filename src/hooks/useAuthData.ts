import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser, registerUser } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // Switched to react-hot-toast
import { AuthFormData, AuthResponse } from "../types/types";
import { AUTH_MESSAGES } from "../constants/authConstants";

export const useAuthData = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginMutation = useMutation<AuthResponse, Error, Omit<AuthFormData, "username">>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      toast.success(AUTH_MESSAGES.LOGIN_SUCCESS);
      navigate("/app/home");
    },
    onError: () => toast.error(AUTH_MESSAGES.LOGIN_ERROR),
  });

  const registerMutation = useMutation<AuthResponse, Error, AuthFormData>({
    mutationFn: registerUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      toast.success(AUTH_MESSAGES.REGISTER_SUCCESS);
      setIsLogin(true);
      setEmail("");
      setUsername("");
      setPassword("");
    },
    onError: () => toast.error(AUTH_MESSAGES.REGISTER_ERROR),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      loginMutation.mutate({ email, password });
    } else {
      registerMutation.mutate({ email, username, password });
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/users/auth/google";
  };

  const toggleForm = () => setIsLogin((prev) => !prev);

  return {
    isLogin,
    email,
    setEmail,
    username,
    setUsername,
    password,
    setPassword,
    loginMutation,
    registerMutation,
    handleSubmit,
    handleGoogleLogin,
    toggleForm,
  };
};