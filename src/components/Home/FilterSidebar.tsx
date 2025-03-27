import React from "react";
import { priceOptions, ratingOptions } from "../../constants/filterConstants";

interface FilterSidebarProps {
  categories: string[];
  selectedCategory: string | null;
  setSelectedCategory: (value: string | null) => void;
  priceFilter: string;
  setPriceFilter: (value: string) => void;
  ratingFilter: string;
  setRatingFilter: (value: string) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  priceFilter,
  setPriceFilter,
  ratingFilter,
  setRatingFilter,
}) => {


// console.log(categories)
  return (
    <div className="w-64 p-4 bg-gray-100 rounded-lg shadow-md h-full">
      <h2 className="text-xl font-bold mb-4">Filters</h2>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Category</h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setSelectedCategory(null)}
              className={`w-full text-left p-2 rounded ${
                selectedCategory === null ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              All
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left p-1 rounded ${
                  selectedCategory === cat
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Price Range</h3>
        <ul className="space-y-1">
          {priceOptions.map((option) => (
            <li key={option.value}>
              <button
                onClick={() => setPriceFilter(option.value)}
                className={`w-full text-left p-1 rounded ${
                  priceFilter === option.value
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-sm font-medium mb-2">Rating</h3>
        <ul className="space-y-1">
          {ratingOptions.map((option) => (
            <li key={option.value}>
              <button
                onClick={() => setRatingFilter(option.value)}
                className={`w-full text-left p-1 rounded ${
                  ratingFilter === option.value
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FilterSidebar;