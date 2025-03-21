import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, updateUser, deleteUser } from "../api/api";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IUser } from "../types/types";

export interface UsersData {
currentPage:number,
total:number,
totalPages:number,
users:IUser[]
}

const UserManagement: React.FC = () => {
  const token = localStorage.getItem("token");
  const role = token ? jwtDecode<{ role: string }>(token).role : "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState<IUser | null>(null);

  const { data: usersData, isLoading, error } = useQuery<UsersData>({
    queryKey: ["users"],
    queryFn: getUsers,
    enabled: !!token && role === "admin",
  });

  console.log(usersData,"users")

  const updateMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Partial<IUser> }) => updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully!");
      setEditingUser(null);
    },
    onError: () => toast.error("Failed to update user."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully!");
    },
    onError: () => toast.error("Failed to delete user."),
  });

  if (!token) {
    navigate("/auth");
    return null;
  }

  if (role !== "admin") {
    toast.error("Admin access required!");
    navigate("/app/home");
    return null;
  }

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error loading users</div>;

  const handleEdit = (user: IUser) => {
    setEditingUser(user);
  };

  const handleSave = () => {
    if (editingUser) {
      updateMutation.mutate({ userId: editingUser._id, data: editingUser });
    }
  };

  return (
    <div className="container mx-auto p-4 mt-16">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6 text-center text-gray-800"
      >
        User Management
      </motion.h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Email</th>
              <th className="p-2">Username</th>
              <th className="p-2">Role</th>
              <th className="p-2">Status</th>
              <th className="p-2">Created At</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersData && usersData.users?.map((user) => (
              <motion.tr
                key={user._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="border-b"
              >
                {editingUser?._id === user._id ? (
                  <>
                    <td className="p-2">
                      <input
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        value={editingUser.username}
                        onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as "user" | "admin" })}
                        className="w-full p-1 border rounded"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        value={editingUser.isBanned ? "Banned" : "Active"}
                        onChange={(e) => setEditingUser({ ...editingUser, isBanned: e.target.value === "Banned" })}
                        className="w-full p-1 border rounded"
                      >
                        <option value="Active">Active</option>
                        <option value="Banned">Banned</option>
                      </select>
                    </td>
                    <td className="p-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="p-2 flex space-x-2">
                      <motion.button
                        onClick={handleSave}
                        className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Save
                      </motion.button>
                      <motion.button
                        onClick={() => setEditingUser(null)}
                        className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Cancel
                      </motion.button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.username}</td>
                    <td className="p-2">{user.role}</td>
                    <td className="p-2">{user.isBanned ? "Banned" : "Active"}</td>
                    <td className="p-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="p-2 flex space-x-2">
                      <motion.button
                        onClick={() => handleEdit(user)}
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaEdit />
                      </motion.button>
                      <motion.button
                        onClick={() => deleteMutation.mutate(user._id)}
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaTrash />
                      </motion.button>
                    </td>
                  </>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;