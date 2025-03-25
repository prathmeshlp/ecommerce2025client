import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { AUTH_MESSAGES } from "../../constants/authConstants";

interface AuthFormProps {
  isLogin: boolean;
  email: string;
  setEmail: (value: string) => void;
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleLogin: () => void;
  onToggleForm: () => void;
  isLoginPending: boolean;
  isRegisterPending: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  isLogin,
  email,
  setEmail,
  username,
  setUsername,
  password,
  setPassword,
  onSubmit,
  onGoogleLogin,
  onToggleForm,
  isLoginPending,
  isRegisterPending,
}) => {
  const formVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, x: -100, transition: { duration: 0.5, ease: "easeIn" } },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isLogin ? "login" : "register"}
        variants={formVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {isLogin ? AUTH_MESSAGES.LOGIN_TITLE : AUTH_MESSAGES.REGISTER_TITLE}
        </h2>
        <form onSubmit={onSubmit} className="space-y-6">
          <motion.div whileHover={{ scale: 1.02 }} className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="email"
              aria-label="Email"
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
                autoComplete="username"
                aria-label="Username"
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
              autoComplete="password"
              aria-label="Password"
            />
          </motion.div>
          <motion.button
            type="submit"
            disabled={isLoginPending || isRegisterPending}
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isLogin ? "Login" : "Register"}
          >
            {isLogin
              ? isLoginPending
                ? AUTH_MESSAGES.LOGGING_IN
                : AUTH_MESSAGES.LOGIN_BUTTON
              : isRegisterPending
              ? AUTH_MESSAGES.REGISTERING
              : AUTH_MESSAGES.REGISTER_BUTTON}
          </motion.button>
        </form>
        <div className="mt-6 text-center">
          <motion.button
            onClick={onGoogleLogin}
            className="w-full p-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Sign in with Google"
          >
            <FcGoogle size={24} />
            <span>{AUTH_MESSAGES.GOOGLE_SIGN_IN}</span>
          </motion.button>
        </div>
        <p className="mt-4 text-center text-gray-600">
          {isLogin ? AUTH_MESSAGES.LOGIN_PROMPT : AUTH_MESSAGES.REGISTER_PROMPT}{" "}
          <button
            onClick={onToggleForm}
            className="text-blue-500 hover:underline focus:outline-none"
            aria-label={isLogin ? "Switch to register" : "Switch to login"}
          >
            {isLogin ? AUTH_MESSAGES.LOGIN_LINK : AUTH_MESSAGES.REGISTER_LINK}
          </button>
        </p>
      </motion.div>
    </AnimatePresence>
  );
};