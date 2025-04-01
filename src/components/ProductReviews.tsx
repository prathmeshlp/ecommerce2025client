import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { getReviews, addReview } from "../api/api";
import { motion } from "framer-motion";
import useCustomFormik from "../hooks/useCustomFormik";
import * as Yup from "yup";
import { jwtDecode } from "jwt-decode";
import { PuffLoader } from "react-spinners";
import { addReview, getReviews } from "../api/productApi";
import { ApiResponse } from "../types/types";

interface Review {
  _id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode<{ id: string }>(token).id : "";

  const { data: reviews, isLoading } = useQuery<ApiResponse<Review[]>>({
    queryKey: ["reviews", productId],
    queryFn: () => getReviews(productId),
  });


  const addReviewMutation = useMutation({
    mutationFn: (data: { rating: number; comment: string }) =>
      addReview(productId, { ...data, userId }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] }),
  });

  const formik = useCustomFormik({
    initialValues: { rating: 5, comment: "" },
    validationSchema: Yup.object({
      rating: Yup.number().min(1).max(5).required("Rating is required"),
      comment: Yup.string().required("Comment is required"),
    }),
    onSubmit: (values) => {
      addReviewMutation.mutate(values);
      formik.resetForm();
    },
  });

  if (isLoading) return <div className="flex justify-center items-center"><PuffLoader /></div>;

  return (
    <div className="reviewContainer w-full flex flex-col justify-center items-center ">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <h3 className="text-2xl font-bold mt-4">Reviews</h3>
        {reviews?.data?.map((review) => (
          <div key={review._id} className="border-b py-2">
            <p>Rating: {review.rating} / 5</p>
            <p>{review.comment}</p>
          </div>
        ))}
        <form onSubmit={formik.handleSubmit} className="mt-4">
          <select
            name="rating"
            value={formik.values.rating}
            onChange={formik.handleChange}
            className="w-full p-2 mb-2 border rounded"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <textarea
            name="comment"
            value={formik.values.comment}
            onChange={formik.handleChange}
            placeholder="Write your review"
            className="w-full p-2 mb-2 border rounded"
          />
          {typeof formik.errors.comment === "string" && (
            <p className="text-red-500">{formik.errors.comment}</p>
          )}
          <div className="submit_buton">
            <motion.button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              whileHover={{ scale: 1.05 }}
            >
              Submit Review
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProductReviews;
