import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  Color: null,
  Size: null,
  Variant: null,
  variantOptions: [],
  AddOns: [],
  isDetailPage: false,
  activeProduct: null,
};

const ProductDetailsSlice = createSlice({
  name: "ProductDetailsSlice",
  initialState,
  reducers: {
    // ProductDetails Reducers
    setColor: (state, { payload }) => {
      state.Color = payload;
    },
    setSize: (state, { payload }) => {
      state.Size = payload;
    },
    setVariant: (state, { payload }) => {
      state.Variant = payload;
    },
    setAddon: (state, { payload }) => {
      state.AddOns = payload;
    },
    setIsDetailPage: (state, { payload }) => {
      state.isDetailPage = payload;
    },
    setVariantOptions: (state, { payload }) => {
      state.variantOptions = payload;
    },

    setActiveProduct: (state, { payload }) => {
      state.activeProduct = payload;
    },

    resetProductDetails: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setColor, setSize, setVariantOptions, setVariant, setAddon, setActiveProduct, setIsDetailPage, resetProductDetails } =
  ProductDetailsSlice.actions;
export default ProductDetailsSlice.reducer;

// Selectors
export const activeProductSelector = (state) => state.ProductDetails.activeProduct;
export const colorSelector = (state) => state.ProductDetails.Color;
export const variantOptionsSelector = (state) => state.ProductDetails.variantOptions;
export const sizeSelector = (state) => state.ProductDetails.Size;
export const variantSelector = (state) => state.ProductDetails.Variant;
export const addOnSelector = (state) => state.ProductDetails.AddOns;
export const isDetailPageSelector = (state) => state.ProductDetails.isDetailPage;
