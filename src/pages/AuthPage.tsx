import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser, registerUser } from "../api/api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc"; // Google logo icon

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      toast.success("Logged in successfully!", { position: "top-right" });
      navigate("/app/home");
    },
    onError: () => toast.error("Login failed. Check your credentials."),
  });

  // Register Mutation
  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      toast.success("Registered successfully! Please log in.");
      setIsLogin(true); // Switch to login form
      setEmail("");
      setUsername("");
      setPassword("");
    },
    onError: () => toast.error("Registration failed."),
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

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.5, ease: "easeIn" },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <Toaster />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "register"}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
              {isLogin ? "Welcome Back" : "Join Us"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div whileHover={{ scale: 1.02 }} className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </motion.div>
              {!isLogin && (
                <motion.div whileHover={{ scale: 1.02 }} className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </motion.div>
              )}
              <motion.div whileHover={{ scale: 1.02 }} className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </motion.div>
              <motion.button
                type="submit"
                disabled={loginMutation.isPending || registerMutation.isPending}
                className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLogin
                  ? loginMutation.isPending
                    ? "Logging in..."
                    : "Login"
                  : registerMutation.isPending
                  ? "Registering..."
                  : "Register"}
              </motion.button>
            </form>
            <div className="mt-6 text-center">
              <motion.button
                onClick={handleGoogleLogin}
                className="w-full p-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FcGoogle size={24} />
                <span>Sign in with Google</span>
              </motion.button>
            </div>
            <p className="mt-4 text-center text-gray-600">
              {isLogin ? "Need an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-500 hover:underline focus:outline-none"
              >
                {isLogin ? "Register" : "Login"}
              </button>
            </p>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AuthPage;
