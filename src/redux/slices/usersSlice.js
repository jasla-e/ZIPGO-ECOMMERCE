import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "https://localhost:7150/api/User";

// Fetch all users
export const fetchUsersAsync = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("Please login");
      }

      const response = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to fetch users"
      );
    }
  }
);

// Search users
export const searchUsersAsync = createAsyncThunk(
  "users/searchUsers",
  async (search = "", { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("Please login");
      }

      const response = await axios.get(`${API}/search`, {
        params: {
          search,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to search users"
      );
    }
  }
);

// Block / Unblock user
export const toggleUserBlockAsync = createAsyncThunk(
  "users/toggleUserBlock",
  async (user, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("Please login");
      }

      await axios.put(
        `${API}/${user.id}/block`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        id: user.id,
        isBlocked: !user.isBlocked,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to update user block status"
      );
    }
  }
);

const usersSlice = createSlice({
  name: "users",

  initialState: {
    users: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // Fetch users
      .addCase(fetchUsersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })

      .addCase(fetchUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search users
      .addCase(searchUsersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(searchUsersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })

      .addCase(searchUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Block / Unblock
      .addCase(toggleUserBlockAsync.fulfilled, (state, action) => {
        const user = state.users.find(
          (user) => user.id === action.payload.id
        );

        if (user) {
          user.isBlocked = action.payload.isBlocked;
        }
      })

      .addCase(toggleUserBlockAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;