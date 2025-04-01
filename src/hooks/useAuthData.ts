import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser, registerUser } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthFormData, AuthResponse } from "../types/types";
import { AUTH_MESSAGES } from "../constants/authConstants";

export const useAuthData = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/; // At least 8 chars, one letter, one number

    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return false;
    }
    
    if (!isLogin && !usernameRegex.test(username)) {
      toast.error("Username must be 3-20 characters long and contain only letters, numbers, and underscores.");
      return false;
    }
    
    if (!passwordRegex.test(password)) {
      toast.error("Password must be at min 8 characters long and contain at least one letter, one number and one special symbol.");
      return false;
    }

    return true;
  };

  const loginMutation = useMutation<AuthResponse, Error, Omit<AuthFormData, "username">>({
    mutationFn: loginUser,
    onSuccess: (res) => {
      localStorage.setItem("token", res?.data.token);
      toast.success(AUTH_MESSAGES.LOGIN_SUCCESS);
      navigate("/app/home");
    },
    onError: () => toast.error(AUTH_MESSAGES.LOGIN_ERROR),
  });

  const registerMutation = useMutation<AuthResponse, Error, AuthFormData>({
    mutationFn: registerUser,
    onSuccess: (res) => {
      localStorage.setItem("token", res.data.token);
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
    if (!validateInputs()) return;
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
