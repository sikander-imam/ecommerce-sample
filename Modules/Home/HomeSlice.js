import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const initialState = {
  businessInfo: null,
  Stores: null,
  Announcements: null,
  FooterPages: null,
  isHomePage: true,
  BusinessURL: null,
  activeCategory: null,
  mainView: true,

  accessToken: null,
  Products: false,

  selectedStore: null,
  city: "",
  hasAccessToken: true,
  hasStores: true,
  hasProducts: true,
  storeModalDisplayed: false,
};

const HomePageSlice = createSlice({
  name: "HomePageSlice",
  initialState: initialState,
  reducers: {
    // Homepage Reducers

    setBusinessInfo: (state, { payload }) => {
      state.businessInfo = payload;
    },

    setStores: (state, { payload }) => {
      state.Stores = payload;
    },

    setAnnouncements: (state, { payload }) => {
      state.Announcements = payload;
    },
    setFooterPages: (state, { payload }) => {
      state.FooterPages = payload;
    },
    setIsHomePage: (state, { payload }) => {
      state.isHomePage = payload;
    },
    getProductsSuccess: (state, { payload }) => {
      state.Products = payload;
    },
    setActiveCategory: (state, { payload }) => {
      state.activeCategory = payload;
    },
    setFirstCatAsActive: (state) => {
      state.activeCategory = state.Products[0].title;
    },
    setMainView: (state) => {
      state.mainView = !state.mainView;
    },
    setAccessToken: (state, { payload }) => {
      state.accessToken = payload;
    },

    setSelectedCity: (state, { payload }) => {
      state.city = payload;
    },
    setSelectedStore: (state, { payload }) => {
      state.selectedStore = payload;
    },
    setBusinessUrl: (state, { payload }) => {
      state.BusinessURL = payload;
    },
    setHasAccessToken: (state) => {
      state.hasAccessToken = false;
    },
    setHasStores: (state) => {
      state.hasStores = false;
    },
    setHasProducts: (state) => {
      state.hasProducts = false;
    },
    setStoreModalDisplayed: (state) => {
      state.storeModalDisplayed = true;
    },

    resetHome: (state) => {
      Object.assign(state, initialState);
    },
    handleStoreSelectionReset: (state) => {
      const newState = { ...initialState };

      newState.storeName = state.storeName;
      newState.Stores = state.Stores;
      newState.Announcements = state.Announcements;
      newState.FooterPages = state.FooterPages;
      newState.accessToken = state.accessToken;
      newState.businessInfo = state.businessInfo;
      newState.BusinessURL = state.BusinessURL;
      Object.assign(state, newState);
      // state = newState;
    },
  },
});

export const {
  getProductsSuccess,
  setAccessToken,
  setStores,
  setSelectedCity,
  setSelectedStore,
  setBusinessUrl,
  setHasAccessToken,
  setHasStores,
  setHasProducts,
  setMainView,
  setActiveCategory,

  setStoreModalDisplayed,
  setAnnouncements,
  setFooterPages,
  setIsHomePage,
  resetHome,
  handleStoreSelectionReset,
  setBusinessInfo,
  setFirstCatAsActive,
} = HomePageSlice.actions;
export default HomePageSlice.reducer;

// Selectors
export const businessInfoSelector = (state) => state.homepage.businessInfo;
export const AllProductsSelector = (state) => state.homepage.Products;
export const businessUrlSelector = (state) => state.homepage.BusinessURL;
export const storesSelector = (state) => state.homepage.Stores;
export const mainViewSelector = (state) => state.homepage.mainView;
export const activeCategorySelector = (state) => state.homepage.activeCategory;

//Not Used
export const accessTokenSelector = (state) => state.homepage.businessInfo && state.homepage.businessInfo.accessToken;

export const citySelector = (state) => state.homepage.city;
export const hasAccessTokenSelector = (state) => state.homepage.hasAccessToken;
export const hasStoresSelector = (state) => state.homepage.hasStores;
export const hasProductsSelector = (state) => state.homepage.hasProducts;
export const StoreModalDisplayedSelector = (state) => state.homepage.storeModalDisplayed;

export const AnnouncementsSelector = (state) => state.homepage.businessInfo && state.homepage.businessInfo.announcements;
export const FooterPagesSelector = (state) => state.homepage.businessInfo && state.homepage.businessInfo.pages;
export const paymentTypesSelector = (state) => state.homepage.businessInfo && state.homepage.businessInfo.paymentTypes;
export const citiesSelector = (state) => state.homepage.businessInfo && state.homepage.businessInfo.states;

export const isHomePageSelector = (state) => state.homepage.isHomePage;

export const fetchUserById = createAsyncThunk("users/fetchByIdStatus", (data, thunkAPI) => {
  console.log(thunkAPI.dispatch);
  console.log(thunkAPI.getState());
  console.log(data);
  return axios.get(`https://jsonplaceholder.typicode.com/posts`);
});
