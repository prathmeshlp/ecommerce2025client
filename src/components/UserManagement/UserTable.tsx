import React from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IUser, UsersData } from "../../types/types";
import { USER_BUTTONS } from "../../constants/userManagementConstants";

interface UserTableProps {
  usersData: UsersData | undefined;
  editingUser: IUser | null;
  setEditingUser: (user: IUser | null) => void;
  onEdit: (user: IUser) => void;
  onSave: () => void;
  onDelete: (userId: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  usersData,
  editingUser,
  setEditingUser,
  onEdit,
  onSave,
  onDelete,
}) => (
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
        {usersData?.users.map((user) => (
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
                    aria-label="Edit user email"
                  />
                </td>
                <td className="p-2">
                  <input
                    value={editingUser.username}
                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                    className="w-full p-1 border rounded"
                    aria-label="Edit username"
                  />
                </td>
                <td className="p-2">
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as "user" | "admin" })}
                    className="w-full p-1 border rounded"
                    aria-label="Edit user role"
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
                    aria-label="Edit user status"
                  >
                    <option value="Active">Active</option>
                    <option value="Banned">Banned</option>
                  </select>
                </td>
                <td className="p-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="p-2 flex space-x-2">
                  <motion.button
                    onClick={onSave}
                    className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Save user"
                  >
                    {USER_BUTTONS.SAVE}
                  </motion.button>
                  <motion.button
                    onClick={() => setEditingUser(null)}
                    className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Cancel edit"
                  >
                    {USER_BUTTONS.CANCEL}
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
                    onClick={() => onEdit(user)}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Edit user ${user.email}`}
                  >
                    <FaEdit />
                  </motion.button>
                  <motion.button
                    onClick={() => onDelete(user._id)}
                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Delete user ${user.email}`}
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
);