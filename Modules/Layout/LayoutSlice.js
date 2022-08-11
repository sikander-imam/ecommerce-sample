import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  pageRefresh: true,
  apiError: null,
  scrollToCategory: null,
  hasData: false,
  loading: false,
};

const LayoutSlice = createSlice({
  name: "LayoutSlice",
  initialState,
  reducers: {
    // Layout Reducers
    setPageRefresh: (state, { payload }) => {
      state.pageRefresh = payload;
    },
    setApiError: (state, { payload }) => {
      state.apiError = payload;
    },
    setScrollToCategory: (state, { payload }) => {
      state.scrollToCategory = payload;
    },
    setHasData: (state, { payload }) => {
      state.hasData = payload;
    },
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
  },
});

export const { setPageRefresh, setApiError, setScrollToCategory, setHasData, setLoading } = LayoutSlice.actions;
export default LayoutSlice.reducer;

// Selectors
export const loadingStateSelector = (state) => state.Layout.loading;
export const pageRefreshSelector = (state) => state.Layout.pageRefresh;
export const hasDataSelector = (state) => state.Layout.hasData;
export const apiErrorSelector = (state) => state.Layout.apiError;
export const scrollToCategorySelector = (state) => state.Layout.scrollToCategory;
