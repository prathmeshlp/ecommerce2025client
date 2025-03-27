import React from "react";
import { motion } from "framer-motion";
import { useProductManagementData } from "../../hooks/useProductManagementData";
import { AddProductForm } from "../../components/ProductManagement/AddProductForm";
import { BulkStockUpdateModal } from "../../components/ProductManagement/BulkStockUpdateModal";
import { ProductTable } from "../../components/ProductManagement/ProductTable";
import { PuffLoader } from "react-spinners";
import { PRODUCT_MESSAGES, PRODUCT_BUTTONS } from "../../constants/productManagementConstants";

const ProductManagement: React.FC = () => {
  const {
    token,
    role,
    productsData,
    productsLoading,
    productsError,
    categories,
    categoriesLoading,
    editingProduct,
    setEditingProduct,
    newProduct,
    setNewProduct,
    isCustomCategory,
    setIsCustomCategory,
    page,
    setPage,
    selectedProducts,
    handleSelectProduct,
    isBulkModalOpen,
    setIsBulkModalOpen,
    bulkStock,
    setBulkStock,
    handleAddProduct,
    handleEdit,
    handleSave,
    handleBulkUpdate,
    deleteMutation,
  } = useProductManagementData();

console.log(categories,"cat")

  if (!token || role !== "admin") return null;

  if (productsLoading || categoriesLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <PuffLoader />
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="w-screen h-screen flex justify-center items-center text-center mt-10 text-red-500">
        {PRODUCT_MESSAGES.ERROR}
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
        {PRODUCT_MESSAGES.TITLE}
      </motion.h1>

      <AddProductForm
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        isCustomCategory={isCustomCategory}
        setIsCustomCategory={setIsCustomCategory}
        categories={categories?.data}
        onAddProduct={handleAddProduct}
      />

      {selectedProducts.length > 0 && (
        <div className="mb-4">
          <motion.button
            onClick={() => setIsBulkModalOpen(true)}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Update stock for ${selectedProducts.length} products`}
          >
            {PRODUCT_BUTTONS.BULK_ACTION} ({selectedProducts.length} selected)
          </motion.button>
        </div>
      )}

      <ProductTable
        productsData={productsData!}
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
        selectedProducts={selectedProducts}
        handleSelectProduct={handleSelectProduct}
        categories={categories?.data}
        onEdit={handleEdit}
        onSave={handleSave}
        onDelete={(productId) => deleteMutation.mutate(productId)}
        page={page}
        setPage={setPage}
      />

      <BulkStockUpdateModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        selectedProducts={selectedProducts}
        bulkStock={bulkStock}
        setBulkStock={setBulkStock}
        onUpdate={handleBulkUpdate}
      />
    </div>
  );
};

export default ProductManagement;