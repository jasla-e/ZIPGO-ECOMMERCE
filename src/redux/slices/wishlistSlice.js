import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchWishlist,
  addWishlistItem,
  deleteWishlistItem,
} from "../../services/wishlistApi";


export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async () => {
    return await fetchWishlist();
  }
);

export const addToWishlistAsync = createAsyncThunk(
  "wishlist/addToWishlist",
  async (item) => {
    return await addWishlistItem(item);
  }
);


export const removeFromWishlistAsync = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (id) => {
    await deleteWishlistItem(id);
    return id;
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    
    builder.addCase(getWishlist.fulfilled, (state, action) => {
      state.items = action.payload || [];
    });

    builder.addCase(addToWishlistAsync.fulfilled, (state, action) => {
      const newItem = action.payload;
      const exists = state.items.some(
        (i) => String(i.productId) === String(newItem.productId)
      );
      if (!exists) {
        state.items.push(newItem);
      }
    });

    builder.addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;