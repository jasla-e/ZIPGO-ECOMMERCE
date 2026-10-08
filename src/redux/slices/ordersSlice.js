import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "https://localhost:7150/api/Order";
const ADMIN_API = "https://localhost:7150/api/AdminOrder";


// GET ALL ORDERS — ADMIN
// GET /api/AdminOrder


export const fetchAllOrdersAsync = createAsyncThunk(
  "orders/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("Please login");
      }

      const res = await axios.get(ADMIN_API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Latest orders first
      return [...res.data].reverse();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to fetch orders"
      );
    }
  }
);



// SEARCH / FILTER ORDERS — ADMIN
// GET /api/AdminOrder/search

export const searchOrdersAsync = createAsyncThunk(
  "orders/searchOrders",
  async ({ search = "", status = "" }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("Please login");
      }

      // Backend uses PascalCase status values
      const backendStatus =
        status === ""
          ? ""
          : status.charAt(0).toUpperCase() + status.slice(1);

      const res = await axios.get(
        `${ADMIN_API}/search`,
        {
          params: {
            search,
            status: backendStatus,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return [...res.data].reverse();

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to search orders"
      );
    }
  }
);

// GET USER ORDERS
// GET /api/Order


export const fetchOrdersAsync = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("Please login");
      }

      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to fetch orders"
      );
    }
  }
);



// POST /api/Order


export const placeOrderAsync = createAsyncThunk(
  "orders/placeOrder",
  async (
    { addressId, paymentMethod },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("Please login");
      }

      const res = await axios.post(
        API,
        {
          addressId,
          paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to place order"
      );
    }
  }
);



// UPDATE ORDER STATUS — ADMIN
// PUT /api/AdminOrder/{id}/status

export const updateOrderStatusAsync = createAsyncThunk(
  "orders/updateStatus",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("Please login");
      }

      const response = await axios.put(
        `${ADMIN_API}/${id}/status`,
        null,
        {
          params: {
            status: data.status,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("STATUS UPDATE RESPONSE:", response.data);

      return {
        id,
        status: data.status,
      };
    } catch (error) {
      console.error(
        "STATUS UPDATE ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to update order status"
      );
    }
  }
);

// SLICE

const ordersSlice = createSlice({
  name: "orders",

  initialState: {
    orders: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {

    
    // ADMIN — FETCH ALL ORDERS
   

    builder
      .addCase(fetchAllOrdersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAllOrdersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })

      .addCase(fetchAllOrdersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });


    
    // ADMIN — SEARCH ORDERS
    
    builder
      .addCase(searchOrdersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(searchOrdersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })

      .addCase(searchOrdersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });


   
    // USER — FETCH ORDERS
  

    builder
      .addCase(fetchOrdersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchOrdersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })

      .addCase(fetchOrdersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });


   
    // PLACE ORDER
  

    builder
      .addCase(placeOrderAsync.fulfilled, (state, action) => {
        state.orders.unshift(action.payload);
      });


    // UPDATE ORDER STATUS


    builder
      .addCase(updateOrderStatusAsync.pending, (state) => {
        state.error = null;
      })

      .addCase(updateOrderStatusAsync.fulfilled, (state, action) => {

        const index = state.orders.findIndex(
          (order) => order.id === action.payload.id
        );

        if (index !== -1) {
          state.orders[index] = {
            ...state.orders[index],
            status: action.payload.status,
          };
        }
      })

      .addCase(updateOrderStatusAsync.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });

  },
});

export default ordersSlice.reducer;