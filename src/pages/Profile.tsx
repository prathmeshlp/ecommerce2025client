import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUser, updateUser } from "../api/api";
import { motion } from "framer-motion";
import useCustomFormik from "../hooks/useCustomFormik";
import * as Yup from "yup";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // Switched to react-hot-toast for consistency

interface IAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface User {
  email: string;
  username: string;
  address: IAddress;
}

const Profile: React.FC = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode<{ id: string }>(token).id : "";
  const navigate = useNavigate();

  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  });

  console.log(user,"user")

  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<User>) => updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      toast.success("Profile updated successfully!");
      navigate("/app/home");
    },
    onError: () => toast.error("Failed to update profile."),
  });

  const formik = useCustomFormik({
    initialValues: {
      email: user?.email || "",
      username: user?.username || "",
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      zip: user?.address?.zip || "",
      country: user?.address?.country || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      username: Yup.string().required("Required"),
      street: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      zip: Yup.string(),
      country: Yup.string(),
    }),
    onSubmit: (values) => {
      const newAddress = {
        street: values.street,
        city: values.city,
        state: values.state,
        zip: values.zip,
        country: values.country,
      };
      updateProfileMutation.mutate({
        email: values.email,
        username: values.username,
        address: newAddress, 
      });
    },
  });

  if (!token) {
    navigate("/");
    return null;
  }

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error loading profile</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="profile-container mx-auto p-4 border-2 mt-16 flex flex-col justify-center items-center max-w-2xl"
    >
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <form onSubmit={formik.handleSubmit} className="w-full max-w-md space-y-4">
        <div>
          <input
            name="email"
            value={formik.values.email || ""}
            onChange={formik.handleChange}
            placeholder="Email"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formik.touched.email && typeof formik.errors.email === "string" && (
            <p className="text-red-500 text-sm">{formik.errors.email}</p>
          )}
        </div>
        <div>
          <input
            name="username"
            value={formik.values.username || ""}
            onChange={formik.handleChange}
            placeholder="Username"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formik.touched.username && typeof formik.errors.username === "string" && (
            <p className="text-red-500 text-sm">{formik.errors.username}</p>
          )}
        </div>
        <h3 className="text-xl mt-4">Update Address</h3>
        <div>
          <input
            name="street"
            value={formik.values.street || ""}
            onChange={formik.handleChange}
            placeholder="Street"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            name="city"
            value={formik.values.city || ""}
            onChange={formik.handleChange}
            placeholder="City"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            name="state"
            value={formik.values.state || ""}
            onChange={formik.handleChange}
            placeholder="State"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            name="zip"
            value={formik.values.zip || ""}
            onChange={formik.handleChange}
            placeholder="Zip"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            name="country"
            value={formik.values.country || ""}
            onChange={formik.handleChange}
            placeholder="Country"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <motion.button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={updateProfileMutation.isPending}
        >
          {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
        </motion.button>
      </form>
      {/* <h3 className="text-xl mt-6">Current Addresses</h3> */}
      {/* {user?.addresses && user.addresses.length > 0 ? (
        user.addresses.map((addr, index) => (
          <div key={index} className="border p-2 mt-2 rounded w-full max-w-md">
            <p className="text-gray-700">
              {addr.street}, {addr.city}, {addr.state}, {addr.zip}, {addr.country}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-600 mt-2">No addresses added yet.</p>
      )} */}
    </motion.div>
  );
};

export default Profile;