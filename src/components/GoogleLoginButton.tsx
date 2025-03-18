import React from "react";

const GoogleLoginButton: React.FC = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/users/auth/google";
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Login with Google
    </button>
  );
};

export default GoogleLoginButton;
