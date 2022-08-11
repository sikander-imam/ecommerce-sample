import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  isLoggedIn: false,
  loggenInUser: null,
  auth_Token: null,
  loading: false,
  error: false,
  Email_Password_Reset: null,
};

const AuthSlice = createSlice({
  name: "AuthSlice",
  initialState,
  reducers: {
    // Auth Reducers
    AuthStart: (state) => {
      state.loading = true;
    },
    AuthFailed: (state, { payload }) => {
      state.error = payload;
    },
    registerSuccess: (state, { payload }) => {
      state.isLoggedIn = true;
      state.loggenInUser = payload;
    },

    loginSuccess: (state, { payload }) => {
      state.isLoggedIn = true;
      state.loggenInUser = payload;
    },

    logoutSuccess: (state) => {
      state.isLoggedIn = false;
      state.loggenInUser = null;
    },
    setEmailForPasswordReset: (state, { payload }) => {
      state.Email_Password_Reset = payload;
    },
    resetAuth: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { AuthStart, AuthFailed, registerSuccess, loginSuccess, logoutSuccess, setEmailForPasswordReset, resetAuth } = AuthSlice.actions;
export default AuthSlice.reducer;

// Selectors
export const AuthStatusSelector = (state) => state.auth.isLoggedIn;
export const loggedInUserSelector = (state) => state.auth.loggenInUser;
export const EmailForPasswordResetSelector = (state) => state.auth.Email_Password_Reset;
