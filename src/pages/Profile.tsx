import React from "react";
import { motion } from "framer-motion";
import { useProfileData } from "../hooks/useProfileData";
import { ProfileForm } from "../components/ProfileForm";
import { PuffLoader } from "react-spinners";
import { PROFILE_MESSAGES } from "../constants/profileConstants";

const Profile: React.FC = () => {
  const {
    token,
    user,
    isLoading,
    error,
    updateProfileMutation,
    handleUpdateProfile,
  } = useProfileData();

  if (!token) {
    return null; // Navigation handled in hook
  }

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <PuffLoader />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-500">{PROFILE_MESSAGES.ERROR}</p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="profile-container mx-auto p-4 border-2 mt-16 flex flex-col justify-center items-center max-w-2xl"
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-800">{PROFILE_MESSAGES.TITLE}</h1>
      <ProfileForm
        user={user}
        onSubmit={handleUpdateProfile}
        isPending={updateProfileMutation.isPending}
      />
    </motion.div>
  );
};

export default Profile;