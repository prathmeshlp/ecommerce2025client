import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    console.log(token,"token")
    if (token) {
      localStorage.setItem("token", token);
      toast.success("Logged in with Google successfully!");
      navigate("/app/home");
    } else {
      toast.error("Google login failed!");
      navigate("/");
    }
  }, [searchParams, navigate]);

  return <div>Loading...</div>;
};

export default AuthCallback;