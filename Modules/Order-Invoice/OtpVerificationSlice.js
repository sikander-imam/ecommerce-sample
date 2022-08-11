import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  mobile_no: "",
  mobileNoVerified: false,
  redirected: false,
};

const OtpVerificationSlice = createSlice({
  name: "OtpVerificationSlice",
  initialState,
  reducers: {
    // OtpVerification Reducers
    setMobileNo: (state, { payload }) => {
      state.mobile_no = payload;
    },
    setMobileNoVerificationStatus: (state) => {
      state.mobileNoVerified = true;
    },
    setRedirected: (state, { payload }) => {
      state.redirected = payload;
    },
    resetOtpVerification: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setMobileNo, setMobileNoVerificationStatus, resetOtpVerification, setRedirected } = OtpVerificationSlice.actions;
export default OtpVerificationSlice.reducer;

// Selectors
export const MobileNumberSelector = (state) => state.OtpVerification.mobile_no;
export const redirectedSelector = (state) => state.OtpVerification.redirected;
