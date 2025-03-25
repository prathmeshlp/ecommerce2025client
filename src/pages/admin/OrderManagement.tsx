import React from "react";
import { motion } from "framer-motion";
import { useOrderManagementData } from "../../hooks/useOrderManagementData";
import { FilterSearchSection } from "../../components/OrderManagement/FilterSearchSection";
import { BulkActionsModal } from "../../components/OrderManagement/BulkActionsModal";
import { OrderTable } from "../../components/OrderManagement/OrderTable";
import { PuffLoader } from "react-spinners";
import { ORDER_MESSAGES, ORDER_BUTTONS } from "../../constants/orderManagementConstants";

const OrderManagement: React.FC = () => {
  const {
    token,
    role,
    ordersData,
    isLoading,
    error,
    editingOrder,
    setEditingOrder,
    expandedOrderId,
    toggleDetails,
    page,
    setPage,
    paymentStatusFilter,
    setPaymentStatusFilter,
    searchQuery,
    setSearchQuery,
    selectedOrders,
    handleSelectOrder,
    isBulkModalOpen,
    setIsBulkModalOpen,
    bulkAction,
    setBulkAction,
    bulkStatus,
    setBulkStatus,
    handleEdit,
    handleSave,
    handleBulkAction,
    deleteMutation,
  } = useOrderManagementData();

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
      <div className="w-screen h-screen flex justify-center items-center text-red-500">
        {ORDER_MESSAGES.ERROR}
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
        {ORDER_MESSAGES.TITLE}
      </motion.h1>

      <FilterSearchSection
        paymentStatusFilter={paymentStatusFilter}
        setPaymentStatusFilter={setPaymentStatusFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />

      {selectedOrders.length > 0 && (
        <div className="mb-4">
          <motion.button
            onClick={() => setIsBulkModalOpen(true)}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Perform bulk action on ${selectedOrders.length} orders`}
          >
            {ORDER_BUTTONS.BULK_ACTION} ({selectedOrders.length} selected)
          </motion.button>
        </div>
      )}

      <OrderTable
        ordersData={ordersData}
        editingOrder={editingOrder}
        setEditingOrder={setEditingOrder}
        expandedOrderId={expandedOrderId}
        toggleDetails={toggleDetails}
        selectedOrders={selectedOrders}
        handleSelectOrder={handleSelectOrder}
        onEdit={handleEdit}
        onSave={handleSave}
        onDelete={(orderId) => deleteMutation.mutate(orderId)}
        page={page}
        setPage={setPage}
      />

      <BulkActionsModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        selectedOrders={selectedOrders}
        bulkAction={bulkAction}
        setBulkAction={setBulkAction}
        bulkStatus={bulkStatus}
        setBulkStatus={setBulkStatus}
        onApply={handleBulkAction}
      />
    </div>
  );
};

export default OrderManagement;