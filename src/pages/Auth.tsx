import React from "react";
import { motion } from "framer-motion";
import { useAuthData } from "../hooks/useAuthData";
import { AuthForm } from "../components/Auth/AuthForm";

const AuthPage: React.FC = () => {
  const {
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
  } = useAuthData();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <AuthForm
          isLogin={isLogin}
          email={email}
          setEmail={setEmail}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          onSubmit={handleSubmit}
          onGoogleLogin={handleGoogleLogin}
          onToggleForm={toggleForm}
          isLoginPending={loginMutation.isPending}
          isRegisterPending={registerMutation.isPending}
        />
      </motion.div>
    </div>
  );
};

export default AuthPage;