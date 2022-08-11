import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  PriceFilters: [
    { id: 0, min: 0, max: 100, selected: false },
    { id: 1, min: 101, max: 200, selected: false },
    { id: 2, min: 201, max: 300, selected: false },
    { id: 2, min: 201, max: Infinity, selected: false },
  ],
  ProductsFilter: null,
  activePrices: [
    { id: 0, min: 0, max: 100, selected: false },
    { id: 1, min: 101, max: 200, selected: false },
    { id: 2, min: 201, max: 300, selected: false },
    { id: 2, min: 300, max: Infinity, selected: false },
  ],
};

const FiltersSlice = createSlice({
  name: "FiltersSlice",
  initialState,
  reducers: {
    // Filters Reducers
    setPriceFilters: (state, { payload }) => {
      state.PriceFilters = payload;
    },
    setProductsFilters: (state, { payload }) => {
      state.ProductsFilter = payload;
    },
    setActivePrices: (state, { payload }) => {
      state.activePrices = payload;
    },
    resetFilters: (state) => (state = initialState),
  },
});

export const { setPriceFilters, setProductsFilters, setActivePrices, resetFilters } = FiltersSlice.actions;
export default FiltersSlice.reducer;

// Selectors
export const PriceFiltersSelector = (state) => state.Filters.PriceFilters;
export const ProductsFiltersSelector = (state) => state.Filters.ProductsFilter;
export const activePricesSelector = (state) => state.Filters.activePrices;
