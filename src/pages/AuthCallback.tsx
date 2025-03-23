import React from "react";
import { PuffLoader } from "react-spinners";
import { useAuthCallback } from "../hooks/useAuthCallback";

const AuthCallback: React.FC = () => {
  useAuthCallback(); // Logic handled in hook

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <PuffLoader />
    </div>
  );
};

export default AuthCallback;