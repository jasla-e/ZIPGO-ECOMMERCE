import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const MAIN_CATEGORY_API =
  "https://localhost:7150/api/MainCategory";

const SUB_CATEGORY_API =
  "https://localhost:7150/api/SubCategory";

// Fetch all main categories
export const fetchMainCategoriesAsync = createAsyncThunk(
  "categories/fetchMainCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(MAIN_CATEGORY_API);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

// Fetch all subcategories
export const fetchSubCategoriesAsync = createAsyncThunk(
  "categories/fetchSubCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(SUB_CATEGORY_API);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

// Fetch subcategories for one main category
export const fetchSubCategoriesByMainCategoryAsync =
  createAsyncThunk(
    "categories/fetchSubCategoriesByMainCategory",
    async (mainCategoryId, { rejectWithValue }) => {
      try {
        const response = await axios.get(
          `${SUB_CATEGORY_API}/by-main-category/${mainCategoryId}`
        );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data || error.message
        );
      }
    }
  );

const initialState = {
  mainCategories: [],
  subCategories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // Main categories
      .addCase(
        fetchMainCategoriesAsync.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchMainCategoriesAsync.fulfilled,
        (state, action) => {
          state.loading = false;
          state.mainCategories = action.payload;
        }
      )

      .addCase(
        fetchMainCategoriesAsync.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // All subcategories
      .addCase(
        fetchSubCategoriesAsync.fulfilled,
        (state, action) => {
          state.subCategories = action.payload;
        }
      )

      // Subcategories by main category
      .addCase(
        fetchSubCategoriesByMainCategoryAsync.fulfilled,
        (state, action) => {
          state.subCategories = action.payload;
        }
      );
  },
});

export default categorySlice.reducer;