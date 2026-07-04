import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchCart,
  addCartItem,
  deleteCartItem,
  updateCartItem,
} from "../../services/cartApi";

import { clearCartApi } from "../../services/cartApi";

const getServerId = (item) => item.id;

const getProductId = (item) =>
  String(item.productId || "");

export const getCart = createAsyncThunk(
  "cart/getCart",
  async () => {
    return await fetchCart();
  }
);

export const addToCartAsync = createAsyncThunk(
  "cart/addToCartAsync",
  async (item) => {
    return await addCartItem(item);
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (id) => {
    await deleteCartItem(id);
    return id;
  }
);


export const updateCartAsync = createAsyncThunk(
  "cart/updateCartAsync",
  async ({ id, updatedItem }) => {
    return await updateCartItem(id, updatedItem);
  }
);

export const clearCartAsync = createAsyncThunk(
  "cart/clearCartAsync",
  async () => {
    await clearCartApi(); 
    return true;
  }
);

const calculateTotal = (items) =>
  items.reduce((acc, item) => {
    return (
      acc +
      (Number(item.price) || 0) *
        (Number(item.quantity) || 0)
    );
  }, 0);

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    cartItems: [],
    totalPrice: 0,
  },

  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
      state.totalPrice = 0;
    },
  },

  extraReducers: (builder) => {
    builder

     
      .addCase(getCart.fulfilled, (state, action) => {
        state.cartItems = action.payload || [];
        state.totalPrice = calculateTotal(state.cartItems);
      })

      
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        const newItem = action.payload;

        const index = state.cartItems.findIndex(
          (i) =>
            getProductId(i) === getProductId(newItem)
        );

        if (index !== -1) {
          state.cartItems[index] = newItem;
        } else {
          state.cartItems.push(newItem);
        }

        state.totalPrice = calculateTotal(state.cartItems);
      })

     
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartItems = state.cartItems.filter(
          (i) => getServerId(i) !== action.payload
        );

        state.totalPrice = calculateTotal(state.cartItems);
      })

      
      .addCase(updateCartAsync.fulfilled, (state, action) => {
        const updated = action.payload;

        const index = state.cartItems.findIndex(
          (i) =>
            getServerId(i) === getServerId(updated)
        );

        if (index !== -1) {
          state.cartItems[index] = updated;
        }

        state.totalPrice = calculateTotal(state.cartItems);
      })

      .addCase(clearCartAsync.fulfilled, (state) => {
        state.cartItems = [];
        state.totalPrice = 0;
      });
  },
});

export const { clearCart } = cartSlice.actions;

export default cartSlice.reducer;