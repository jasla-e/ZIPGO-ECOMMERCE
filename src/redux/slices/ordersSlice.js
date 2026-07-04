import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:4000/orders";

// ALL ORDERS — Admin//
export const fetchAllOrdersAsync = createAsyncThunk(
  "orders/fetchAllOrders",
  async () => {
    const res = await axios.get(API);
    return res.data.reverse();
  }
);

// USER ORDERS ONLY//
export const fetchOrdersAsync = createAsyncThunk(
  "orders/fetchOrders",
  async () => {
    const user = JSON.parse(localStorage.getItem("auth_user"));
    const res = await axios.get(`${API}?userId=${user.id}`);
    return res.data.reverse();
  }
);

// PLACE ORDER
export const placeOrderAsync = createAsyncThunk(
  "orders/placeOrder",
  async (orderData) => {
    const user = JSON.parse(localStorage.getItem("auth_user"));
    const res = await axios.post(API, {
      ...orderData,
      userId: user.id,
      status: "pending",
    });
    return res.data;
  }
);

// UPDATE ORDER STATUS
export const updateOrderStatusAsync = createAsyncThunk(
  "orders/updateStatus",
  async ({ id, data }) => {
    const res = await axios.patch(`${API}/${id}`, data);
    return res.data;
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {

    // fetch all 
    builder
      .addCase(fetchAllOrdersAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrdersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrdersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // fetch user orders
    builder
      .addCase(fetchOrdersAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrdersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrdersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder.addCase(placeOrderAsync.fulfilled, (state, action) => {
      state.orders.unshift(action.payload);
    });

    builder.addCase(updateOrderStatusAsync.fulfilled, (state, action) => {
      const index = state.orders.findIndex((o) => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = { ...state.orders[index], ...action.payload };
      }
    });
  },
});

export default ordersSlice.reducer;