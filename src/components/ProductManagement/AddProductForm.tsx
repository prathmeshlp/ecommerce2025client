import React from "react";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import {
  PRODUCT_MESSAGES,
  PRODUCT_BUTTONS,
} from "../../constants/productManagementConstants";
import { Categories } from "../../types/types";

interface AddProductFormProps {
  newProduct: {
    name: string;
    price: number;
    image: string;
    category: string;
    stock: number;
    description: string;
  };
  setNewProduct: (product: {
    name: string;
    price: number;
    image: string;
    category: string;
    stock: number;
    description: string;
  }) => void;
  isCustomCategory: boolean;
  setIsCustomCategory: (value: boolean) => void;
  categories: Categories | undefined;
  onAddProduct: () => void;
}

export const AddProductForm: React.FC<AddProductFormProps> = ({
  newProduct,
  setNewProduct,
  isCustomCategory,
  setIsCustomCategory,
  categories,
  onAddProduct,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-white p-4 rounded-lg shadow-md mb-8"
  >
    <h2 className="text-xl font-semibold mb-4">{PRODUCT_MESSAGES.ADD_NEW}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <input
        value={newProduct.name}
        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        placeholder="Name"
        className="p-2 border rounded w-full"
        aria-label="Product name"
      />
      <input
        type="number"
        value={newProduct.price || ""}
        onChange={(e) =>
          setNewProduct({ ...newProduct, price: Number(e.target.value) })
        }
        placeholder="Price"
        className="p-2 border rounded w-full"
        min="0"
        step="1"
        aria-label="Product price"
      />
      <input
        value={newProduct.image}
        onChange={(e) =>
          setNewProduct({ ...newProduct, image: e.target.value })
        }
        placeholder="Image URL"
        className="p-2 border rounded w-full"
        aria-label="Product image URL"
      />
      <div className="flex items-center space-x-2">
        {!isCustomCategory ? (
          <select
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            className="p-2 border rounded w-full"
            aria-label="Select category"
          >
            <option value="">Select Category</option>
            {Array.isArray(categories)
              ? categories?.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))
              : null}
          </select>
        ) : (
          <input
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            placeholder="New Category"
            className="p-2 border rounded w-full"
            aria-label="Custom category"
          />
        )}
        <button
          onClick={() => setIsCustomCategory(!isCustomCategory)}
          className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          aria-label={
            isCustomCategory ? "Use existing category" : "Add new category"
          }
        >
          {isCustomCategory ? "Select" : PRODUCT_BUTTONS.TOGGLE_CATEGORY}
        </button>
      </div>
      {/* <div className="flex items-center space-x-2 w-full border-2"> */}
        <input
          type="number"
          value={newProduct.stock || ""}
          onChange={(e) =>
            setNewProduct({ ...newProduct, stock: Number(e.target.value) })
          }
          placeholder="Stock"
          className="p-2   border rounded w-full"
          min="0"
          step="1"
          aria-label="Product stock"
        />
        <textarea
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
          placeholder="Product Description"
          className="p-2 border rounded w-full "
          rows={3}
          aria-label="Product description"
        />
      </div>
    {/* </div> */}
    <div className="addproductbtn flex justify-end mt-4">
      <motion.button
        onClick={onAddProduct}
        className="p-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Add product"
      >
        <FaPlus className="mr-2" /> {PRODUCT_BUTTONS.ADD}
      </motion.button>
      </div>
  </motion.div>
);
