import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:4000/users";

// Fetch Users//
export const fetchUsersAsync = createAsyncThunk(
  "users/fetchUsers",
  async () => {
    const response = await axios.get(API);
    return response.data;
  }
);

// Block / Unblock User//
export const toggleUserBlockAsync = createAsyncThunk(
  "users/toggleUserBlock",
  async (user) => {
    const updatedUser = {
      ...user,
      isBlocked: !user.isBlocked,
    };

    await axios.put(`${API}/${user.id}`, updatedUser);

    return updatedUser;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchUsersAsync.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })

      .addCase(toggleUserBlockAsync.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );

        if (index !== -1) {
          state.users[index] = action.payload;
        }
      });
  },
});

export default usersSlice.reducer;