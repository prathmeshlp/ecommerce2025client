import React from "react";
import { useRouteError } from "react-router-dom";
import { motion } from "framer-motion";
import { ERROR_MESSAGES } from "../constants/errorConstants";

interface RouteError {
  statusText?: string;
  message?: string;
}

const Error: React.FC = () => {
  const error = useRouteError() as RouteError | undefined;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gray-100"
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">{ERROR_MESSAGES.TITLE}</h1>
        <p className="text-lg mb-2">{ERROR_MESSAGES.SUBTITLE}</p>
        <p className="text-gray-600">
          {error?.statusText || error?.message || ERROR_MESSAGES.UNKNOWN}
        </p>
        <a
          href="/"
          className="mt-4 inline-block p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          aria-label="Return to login page"
        >
          {ERROR_MESSAGES.GO_TO_LOGIN}
        </a>
      </div>
    </motion.div>
  );
};

export default Error;