export const ITEMS_PER_PAGE = 10;

export const PRICE_FILTERS = {
  ALL: "all",
  BELOW_1000: "below1000",
  RANGE_1000_3000: "1000-3000",
  RANGE_3000_6000: "3000-6000",
  ABOVE_6000: "above6000",
};

export const RATING_FILTERS = {
  ALL: "all",
  ABOVE_4: "4above",
  ABOVE_3: "3above",
  ABOVE_2: "2above",
};

export const priceOptions = [
  { label: "All", value: "all" },
  { label: "Below ₹1,000", value: "below1000" },
  { label: "₹1,000 - ₹3,000", value: "1000-3000" },
  { label: "₹3,000 - ₹6,000", value: "3000-6000" },
  { label: "Above ₹6,000", value: "above6000" },
];

export const ratingOptions = [
  { label: "All", value: "all" },
  { label: "4+ Stars", value: "4above" },
  { label: "3+ Stars", value: "3above" },
  { label: "2+ Stars", value: "2above" },
];