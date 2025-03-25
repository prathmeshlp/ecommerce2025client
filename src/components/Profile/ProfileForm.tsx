import React from "react";
import { motion } from "framer-motion";
import useCustomFormik from "../../hooks/useCustomFormik";
import * as Yup from "yup";
import { User } from "../../types/types";
import { PROFILE_MESSAGES } from "../../constants/profileConstants";

interface ProfileFormProps {
  user: User | undefined;
  onSubmit: (values: {
    email: string;
    username: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }) => void;
  isPending: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ user, onSubmit, isPending }) => {
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
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit} className="w-full max-w-md space-y-4">
      <div>
        <input
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          placeholder="Email"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Email"
        />
        {formik.touched.email && typeof formik.errors.email === "string" && (
          <p className="text-red-500 text-sm">{formik.errors.email}</p>
        )}
      </div>
      <div>
        <input
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          placeholder="Username"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Username"
        />
        {formik.touched.username && typeof formik.errors.username === "string" && (
          <p className="text-red-500 text-sm">{formik.errors.username}</p>
        )}
      </div>
      <h3 className="text-xl mt-4 text-gray-800">{PROFILE_MESSAGES.UPDATE_ADDRESS}</h3>
      <div>
        <input
          name="street"
          value={formik.values.street}
          onChange={formik.handleChange}
          placeholder="Street"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Street"
        />
      </div>
      <div>
        <input
          name="city"
          value={formik.values.city}
          onChange={formik.handleChange}
          placeholder="City"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="City"
        />
      </div>
      <div>
        <input
          name="state"
          value={formik.values.state}
          onChange={formik.handleChange}
          placeholder="State"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="State"
        />
      </div>
      <div>
        <input
          name="zip"
          value={formik.values.zip}
          onChange={formik.handleChange}
          placeholder="Zip"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Zip"
        />
      </div>
      <div>
        <input
          name="country"
          value={formik.values.country}
          onChange={formik.handleChange}
          placeholder="Country"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Country"
        />
      </div>
      <motion.button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isPending}
        aria-label="Update profile"
      >
        {isPending ? PROFILE_MESSAGES.UPDATING : PROFILE_MESSAGES.UPDATE_BUTTON}
      </motion.button>
    </form>
  );
};