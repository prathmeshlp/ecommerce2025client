import React from "react";
import { ORDER_MESSAGES } from "../../constants/orderManagementConstants";
import { PuffLoader } from "react-spinners";

interface FilterSearchSectionProps {
  paymentStatusFilter: string | undefined;
  setPaymentStatusFilter: (value: string | undefined) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  setPage: (page: number) => void;
  isLoading:boolean;
}

export const FilterSearchSection: React.FC<FilterSearchSectionProps> = ({
  paymentStatusFilter,
  setPaymentStatusFilter,
  searchQuery,
  setSearchQuery,
  setPage,
  isLoading
}) => {

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <PuffLoader />
      </div>
    );
  }
  
  return (
  <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-4">{ORDER_MESSAGES.FILTER_SEARCH}</h2>
    <div className="flex flex-col md:flex-row gap-4">
      <select
        value={paymentStatusFilter || ""}
        onChange={(e) => {
          setPaymentStatusFilter(e.target.value || undefined);
          setPage(1);
        }}
        className="p-2 border rounded w-full md:w-1/4"
        aria-label="Filter by payment status"
      >
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="failed">Failed</option>
      </select>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setPage(1);
        }}
        placeholder="Search by Order ID or Email"
        className="p-2 border rounded w-full md:w-1/2"
        aria-label="Search orders"
      />
    </div>
  </div>
)
};