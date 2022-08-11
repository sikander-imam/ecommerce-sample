import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  discount: 0,
  gift: false,
  tax: 0,
  products: [],
};

const CartSlice = createSlice({
  name: "CartSlice",
  initialState,
  reducers: {
    // Cart Reducers
    addProduct: (state, { payload }) => {
      state.products.push(payload);
    },

    updateProduct: (state, { payload }) => {
      state.products[payload.index] = payload.product;
    },

    deleteProduct: (state, { payload }) => {
      return {
        ...state,
        products: state.products.filter((pro, index) => index !== payload),
      };
    },
    changeQuantity: (state, { payload }) => {
      console.log(payload);
      state.products[payload.index] = payload.cart_product;
    },
    addDiscount: (state, { payload }) => {
      state.discount = payload;
    },
    setGift: (state) => {
      state.gift = !state.gift;
    },
    setCartProducts: (state, { payload }) => {
      state.products = payload;
    },
    setTax: (state, { payload }) => {
      state.tax = payload;
    },
    resetCart: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { addProduct, deleteProduct, changeQuantity, addDiscount, setGift, updateProduct, setCartProducts, setTax, resetCart } =
  CartSlice.actions;
export default CartSlice.reducer;

// Selectors
export const CartProductsSelector = (state) => state.Cart.products;
export const CartDiscountSelector = (state) => state.Cart.discount;
export const CartGiftStatusSelector = (state) => state.Cart.gift;
export const CartTaxSelector = (state) => state.Cart.tax;
