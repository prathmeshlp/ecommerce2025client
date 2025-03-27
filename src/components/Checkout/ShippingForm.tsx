import React from "react";
import { motion } from "framer-motion";
import useCustomFormik from "../../hooks/useCustomFormik";
import * as Yup from "yup";
import { ShippingAddress } from "../../types/types";
import { CHECKOUT_MESSAGES } from "../../constants/checkoutConstants";

interface ShippingFormProps {
  onSubmit: (values: ShippingAddress) => void;
  isPending: boolean;
  scriptLoaded: boolean;
}

export const ShippingForm: React.FC<ShippingFormProps> = ({
  onSubmit,
  isPending,
  scriptLoaded,
}) => {
  const formik = useCustomFormik({
    initialValues: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "India",
    },
    validationSchema: Yup.object({
      street: Yup.string().required("Required"),
      city: Yup.string().required("Required"),
      state: Yup.string().required("Required"),
      zip: Yup.string().required("Required"),
      country: Yup.string().required("Required"),
    }),
    onSubmit: (values) => onSubmit(values as ShippingAddress),
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Shipping Address</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <input
            name="street"
            value={formik.values.street}
            onChange={formik.handleChange}
            placeholder="Street"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Street address"
          />
          {formik.touched.street && typeof formik.errors.street === "string" && (
            <p className="text-red-500 text-sm">{formik.errors.street}</p>
          )}
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
          {formik.touched.city && typeof formik.errors.city === "string" && (
            <p className="text-red-500 text-sm">{formik.errors.city}</p>
          )}
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
          {formik.touched.state && typeof formik.errors.state === "string" && (
            <p className="text-red-500 text-sm">{formik.errors.state}</p>
          )}
        </div>
        <div>
          <input
            name="zip"
            value={formik.values.zip}
            onChange={formik.handleChange}
            placeholder="Zip"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Zip code"
          />
          {formik.touched.zip && typeof formik.errors.zip === "string" && (
            <p className="text-red-500 text-sm">{formik.errors.zip}</p>
          )}
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
          {formik.touched.country && typeof formik.errors.country === "string" && (
            <p className="text-red-500 text-sm">{formik.errors.country}</p>
          )}
        </div>
        <motion.button
          type="submit"
          className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isPending || !scriptLoaded}
          aria-label="Place order"
        >
          {isPending ? CHECKOUT_MESSAGES.PROCESSING : CHECKOUT_MESSAGES.PLACE_ORDER}
        </motion.button>
      </form>
    </div>
  );
};