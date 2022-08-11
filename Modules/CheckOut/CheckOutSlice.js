import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  additional_comment: "",
  draftOrder: null,
  overallDiscount: 0,
  discount_code: null,
  states: null,
  payment_types: false,
  store_areas: { shipping_address: [], billing_address: [] },
  shippingAreas: null,
  billingAreas: null,
  payment: null,
  selectedShippingArea: null,
  selectedPaymentType: null,
  TipAmount: 0,
  shippingInfo: {
    same_billing_address: true,
    shipping_address: { is_subscribed: false },
    billing_address: { is_subscribed: false },
  },
  CCAvenueResponse: {},
  showCCAvenue: false,
  redirectedFromCCAvenue: false,
  orderResponse: null,
  orderSuccess: false,
  DeliveryInfo: null,
  areaApiError: "",
};

const CheckoutSlice = createSlice({
  name: "CheckoutSlice",
  initialState,
  reducers: {
    // Checkout Reducers
    saveComment: (state, { payload }) => {
      state.additional_comment = payload;
    },
    updateShippingInfo: (state, { payload }) => {
      return {
        ...state,
        shippingInfo: payload,
      };
    },
    setStates: (state, { payload }) => {
      state.states = payload;
    },
    setAreaApiError: (state, { payload }) => {
      state.areaApiError = payload;
    },
    setPaymentTypes: (state, { payload }) => {
      state.payment_types = payload;
    },
    setStoreAreas: (state, { payload }) => {
      state.store_areas = payload;
    },
    setPaymentStatus: (state, { payload }) => {
      state.payment = payload;
    },
    setDiscountCode: (state, { payload }) => {
      state.discount_code = payload;
    },
    setOverallDiscount: (state, { payload }) => {
      state.overallDiscount = payload;
    },
    setSelectedPaymentType: (state, { payload }) => {
      state.selectedPaymentType = payload;
    },
    setSelectedArea: (state, { payload }) => {
      state.selectedShippingArea = payload;
    },
    setDraftOrder: (state, { payload }) => {
      state.draftOrder = payload;
    },
    setBillingAreas: (state, { payload }) => {
      state.billingAreas = payload;
    },
    setShippingAreas: (state, { payload }) => {
      state.shippingAreas = payload;
    },

    setTipAmount: (state, { payload }) => {
      state.TipAmount = payload;
    },

    setCCAvenueResponse: (state, { payload }) => {
      state.CCAvenueResponse = payload;
    },
    setShowCCAvenue: (state, { payload }) => {
      state.showCCAvenue = payload;
    },
    setRedirectedFromCCAvenue: (state, { payload }) => {
      state.redirectedFromCCAvenue = payload;
    },
    setOrderResponse: (state, { payload }) => {
      state.orderResponse = payload;
    },
    setOrderSuccess: (state, { payload }) => {
      state.orderSuccess = payload;
    },
    setDeliveryInfo: (state, { payload }) => {
      state.DeliveryInfo = payload;
    },
    resetStoreAreas: (state) => {
      state.store_areas = initialState.store_areas;
      state.selectedArea = initialState.selectedArea;
    },
    resetCheckout: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  saveComment,
  setTipAmount,
  setAreaApiError,
  updateShippingInfo,
  setStates,
  setPaymentTypes,
  setStoreAreas,
  setPaymentStatus,
  setDiscountCode,
  setOverallDiscount,
  setSelectedPaymentType,
  setSelectedArea,
  setDraftOrder,
  resetCheckout,
  setShowCCAvenue,
  setRedirectedFromCCAvenue,
  setOrderResponse,
  setOrderSuccess,
  resetStoreAreas,
  setBillingAreas,
  setShippingAreas,
  setDeliveryInfo,
  // setCCAvenueResponse,
} = CheckoutSlice.actions;
export default CheckoutSlice.reducer;

// Selectors
export const commentSelector = (state) => state.Checkout.additional_comment;
export const shippingInfoSelector = (state) => state.Checkout.shippingInfo;
export const paymentStatusSelector = (state) => state.Checkout.payment;
export const discountCodeSelector = (state) => state.Checkout.discount_code;
export const overallDiscountSelector = (state) => state.Checkout.overallDiscount;
export const storeAreasSelector = (state) => state.Checkout.store_areas;
export const SelectedPaymentTypeSelector = (state) => state.Checkout.selectedPaymentType;
export const selectedAreaSelector = (state) => state.Checkout.selectedShippingArea;
export const draftOrderSelector = (state) => state.Checkout.draftOrder;
export const CCAvenueResponseSelector = (state) => state.Checkout.CCAvenueResponse;
export const tipAmountSelector = (state) => state.Checkout.TipAmount;

export const showCCAvenueSelector = (state) => state.Checkout.showCCAvenue;
export const redirectedFromCCAvenueSelector = (state) => state.Checkout.redirectedFromCCAvenue;
export const orderResponseSelector = (state) => state.Checkout.orderResponse;
export const orderSuccessSelector = (state) => state.Checkout.orderSuccess;
export const shippingAreasSelector = (state) => state.Checkout.shippingAreas;
export const billingAreasSelector = (state) => state.Checkout.billingAreas;
export const deliveryInfoSelector = (state) => state.Checkout.DeliveryInfo;
export const areaApiErrorSelector = (state) => state.Checkout.areaApiError;
