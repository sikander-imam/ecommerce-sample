import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import HomePageReducer from "../Modules/Home/HomeSlice";
import AuthReducer from "../Modules/Auth/AuthSlice";
import CartReducer from "../Modules/Cart/CartSlice";
import CheckoutReducer from "../Modules/CheckOut/CheckOutSlice";
import FiltersReducer from "../Modules/Home/Components/FilterSlice";
import ProductDetailsReducer from "../Modules/Product-Details/ProductDetailsSlice";
import OtpVerificationReducer from "../Modules/Order-Invoice/OtpVerificationSlice";
import OrderHistoryReducer from "../Modules/Order-History/OrderHistorySlice";
import SearchKeywordReducer from "../Modules/Home/Components/SearchKeywordSlice";
import LayoutReducer from "../Modules/Layout/LayoutSlice";

const reducers = combineReducers({
  auth: AuthReducer,
  homepage: HomePageReducer,
  Cart: CartReducer,
  Checkout: CheckoutReducer,
  Filters: FiltersReducer,
  ProductDetails: ProductDetailsReducer,
  OtpVerification: OtpVerificationReducer,
  OrderHistory: OrderHistoryReducer,
  SearchKeyword: SearchKeywordReducer,
  Layout: LayoutReducer,
});

const persistConfig = {
  key: "root",
  storage,
  // whitelist: ["cart"],
  blacklist: ["Layout", "OrderHistory"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default configureStore({
  reducer: persistedReducer,
  //reducer: reducers,
  devTools: process.env.NODE_ENV === "production" ? false : true,
  // devTools: false,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});
