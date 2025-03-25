import React from "react";
import { motion } from "framer-motion";
import { useUserManagementData } from "../../hooks/useUserManagementData";
import { UserTable } from "../../components/UserManagement/UserTable";
import { PuffLoader } from "react-spinners";
import { USER_MESSAGES } from "../../constants/userManagementConstants";

const UserManagement: React.FC = () => {
  const {
    token,
    role,
    usersData,
    isLoading,
    error,
    editingUser,
    setEditingUser,
    handleEdit,
    handleSave,
    deleteMutation,
  } = useUserManagementData();

  if (!token || role !== "admin") return null;

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <PuffLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        {USER_MESSAGES.ERROR}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 mt-16">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6 text-center text-gray-800"
      >
        {USER_MESSAGES.TITLE}
      </motion.h1>

      <UserTable
        usersData={usersData}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
        onEdit={handleEdit}
        onSave={handleSave}
        onDelete={(userId) => deleteMutation.mutate(userId)}
      />
    </div>
  );
};

export default UserManagement;