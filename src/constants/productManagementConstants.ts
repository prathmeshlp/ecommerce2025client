export const PRODUCT_MESSAGES = {
    TITLE: "Product Management",
    ADD_NEW: "Add New Product",
    ERROR: "Error loading products",
    ADMIN_REQUIRED: "Admin access required!",
    CREATE_SUCCESS: "Product created successfully!",
    UPDATE_SUCCESS: "Product updated successfully!",
    DELETE_SUCCESS: "Product deleted successfully!",
    BULK_SUCCESS: "Bulk stock update successful!",
    CREATE_ERROR: "Failed to create product.",
    UPDATE_ERROR: "Failed to update product.",
    DELETE_ERROR: "Failed to delete product.",
    BULK_ERROR: "Failed to update stock.",
    NAME_REQUIRED: "Product name is required.",
    PRICE_POSITIVE: "Price must be a positive number.",
    IMAGE_REQUIRED: "Image URL is required.",
    STOCK_NON_NEGATIVE: "Stock must be a non-negative number.",
    CATEGORY_EMPTY: "Category cannot be empty if provided.",
    NO_PRODUCTS_SELECTED: "Please select at least one product.",
    STOCK_INVALID: "Stock must be a non-negative number.",
  };
  
  export const PRODUCT_BUTTONS = {
    ADD: "Add Product",
    SAVE: "Save",
    CANCEL: "Cancel",
    UPDATE_STOCK: "Update Stock",
    BULK_ACTION: "Update Stock",
    PREV: "Previous",
    NEXT: "Next",
    TOGGLE_CATEGORY: "Add New",
  };
  
  export const LOW_STOCK_THRESHOLD = 10;