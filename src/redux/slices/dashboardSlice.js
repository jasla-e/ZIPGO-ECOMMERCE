import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "https://localhost:7150/api/AdminDashboard";

// Fetch complete dashboard data
export const fetchDashboardAsync = createAsyncThunk(
  "dashboard/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

// Fetch top products based on selected month
export const fetchTopProductsAsync = createAsyncThunk(
  "dashboard/fetchTopProducts",
  async (month, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API}/top-products`, {
        params: month ? { month } : {},
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

const initialState = {
  data: null,
  topProducts: [],

  loading: false,
  topProductsLoading: false,

  error: null,
  topProductsError: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    // Dashboard
    builder
      .addCase(fetchDashboardAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchDashboardAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;

        // Initial top products come from dashboard API
        state.topProducts = action.payload.topProducts || [];
      })

      .addCase(fetchDashboardAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Top Products
    builder
      .addCase(fetchTopProductsAsync.pending, (state) => {
        state.topProductsLoading = true;
        state.topProductsError = null;
      })

      .addCase(fetchTopProductsAsync.fulfilled, (state, action) => {
        state.topProductsLoading = false;
        state.topProducts = action.payload;
      })

      .addCase(fetchTopProductsAsync.rejected, (state, action) => {
        state.topProductsLoading = false;
        state.topProductsError = action.payload;
      });
  },
});

export default dashboardSlice.reducer;