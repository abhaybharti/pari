import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: Cookies.get("cart")
      ? JSON.parse(Cookies.get("cart"))
      : { cartItems: [], shippingAddress: {}, paymentMethod: "" },
  },
  reducers: {
    CART_ADD_ITEM: (state, action) => {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }));
      state.cart.cartItems.push(cartItems);
    },
    CART_REMOVE_ITEM: (state, action) => {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.slug !== action.payload.slug
      );
      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }));
      state.cart.cartItems.pop;
    },
    CART_RESET: (state) => {
      state.cart.cartItems = 0;
      state.cart.shippingAddress.location = {};
      state.cart.paymentMethod = "";
    },

    CART_CLEAR_ITEMS: (state) => {
      state.cart.cartItems = [];
    },
    SAVE_SHIPPING_ADDRESS: (state, action) => {
      state.cart.shippingAddress.push(action.payload);
    },
    SAVE_PAYMENT_METHOD: (state, action) => {
      state.cart.paymentMethod.push(action.payload);
    },
  },
});

export const {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_RESET,
  CART_CLEAR_ITEMS,
  SAVE_SHIPPING_ADDRESS,
  SAVE_PAYMENT_METHOD,
} = cartSlice.actions;
export default cartSlice.reducer;
