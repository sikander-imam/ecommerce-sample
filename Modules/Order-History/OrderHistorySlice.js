import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  myOrders: [],
  pagination: null,
  newOrder: null,
  trackOrder: null,
};

const OrderHistorySlice = createSlice({
  name: "OrderHistorySlice",
  initialState,
  reducers: {
    // OrderHistory Reducers
    setMyOrders: (state, { payload }) => {
      state.myOrders = payload;
    },
    setPagination: (state, { payload }) => {
      state.pagination = payload;
    },
    setNewOrder: (state, { payload }) => {
      state.newOrder = payload;
    },
    setTrackOrder: (state, { payload }) => {
      state.trackOrder = payload;
    },
    resetOrderHistory: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setMyOrders, setPagination, resetOrderHistory, setNewOrder, setTrackOrder } = OrderHistorySlice.actions;
export default OrderHistorySlice.reducer;

// Selectors
export const myOrdersSelector = (state) => state.OrderHistory.myOrders;
export const paginationSelector = (state) => state.OrderHistory.pagination;
export const newOrderSelector = (state) => state.OrderHistory.newOrder;
export const trackOrderSelector = (state) => state.OrderHistory.trackOrder;
