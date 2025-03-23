import React from "react";
import { motion } from "framer-motion";
import { useDiscountManagementData } from "../../hooks/useDiscountManagementData";
import { AddDiscountForm } from "../../components/AddDiscountForm";
import { BulkActions } from "../../components/BulkActions";
import { DiscountTable } from "../../components/DiscountTable";
import { PuffLoader } from "react-spinners";
import { DISCOUNT_MESSAGES } from "../../constants/discountConstants";

const DiscountManagement: React.FC = () => {
  const {
    token,
    role,
    discountsData,
    isLoading,
    error,
    productsData,
    productsLoading,
    editingDiscount,
    setEditingDiscount,
    newDiscount,
    setNewDiscount,
    page,
    setPage,
    productsPage,
    setProductsPage,
    selectedDiscounts,
    // setSelectedDiscounts,
    filterStatus,
    setFilterStatus,
    expandedRows,
    toggleRowExpansion,
    bulkUpdateMutation,
    handleAddDiscount,
    handleEdit,
    handleSave,
    handleSelectDiscount,
    deleteMutation,
  } = useDiscountManagementData();

  if (!token || role !== "admin") return null; // Navigation handled in hook

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <PuffLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen h-screen flex justify-center items-center text-red-500">
        {DISCOUNT_MESSAGES.ERROR}
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
        {DISCOUNT_MESSAGES.TITLE}
      </motion.h1>

      <AddDiscountForm
        newDiscount={newDiscount}
        setNewDiscount={setNewDiscount}
        productsData={productsData}
        productsLoading={productsLoading}
        productsPage={productsPage}
        setProductsPage={(page: number) => {
          setProductsPage(page);
          return page;
        }}
        onAddDiscount={handleAddDiscount}
      />

      <div className="mb-4 flex justify-between items-center">
        {selectedDiscounts.length > 0 && (
          <BulkActions
            selectedDiscounts={selectedDiscounts}
            onActivate={() => bulkUpdateMutation.mutate({ discountIds: selectedDiscounts, isActive: true })}
            onDeactivate={() => bulkUpdateMutation.mutate({ discountIds: selectedDiscounts, isActive: false })}
          />
        )}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as "all" | "active" | "inactive")}
          className="p-2 border rounded"
          aria-label="Filter discounts by status"
        >
          <option value="all">{DISCOUNT_MESSAGES.ALL_DISCOUNTS}</option>
          <option value="active">{DISCOUNT_MESSAGES.ACTIVE}</option>
          <option value="inactive">{DISCOUNT_MESSAGES.INACTIVE}</option>
        </select>
      </div>

      <DiscountTable
        discountsData={discountsData}
        editingDiscount={editingDiscount}
        setEditingDiscount={setEditingDiscount}
        expandedRows={expandedRows}
        toggleRowExpansion={toggleRowExpansion}
        selectedDiscounts={selectedDiscounts}
        handleSelectDiscount={handleSelectDiscount}
        onEdit={handleEdit}
        onSave={handleSave}
        onDelete={(discountId) => deleteMutation.mutate(discountId)}
        page={page}
        setPage={setPage}
      />
    </div>
  );
};

export default DiscountManagement;