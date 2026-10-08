import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://localhost:7150/api/Product";


// FETCH PRODUCTS//
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const res = await axios.get(BASE_URL);

    return res.data;
  }
);

// FILTER PRODUCTS//
export const fetchFilteredProducts = createAsyncThunk(
  "products/fetchFilteredProducts",
  async (filters) => {
    const res = await axios.get(`${BASE_URL}/filter`, {
      params: filters,
    });

    return res.data;
  }
);

// ADMIN PRODUCTS - SEARCH + PAGINATION
export const fetchAdminProducts = createAsyncThunk(
  "products/fetchAdminProducts",
  async ({ search = "", page = 1, pageSize = 4 }) => {
    const token = localStorage.getItem("token");

    const res = await axios.get(`${BASE_URL}/admin`, {
      params: {
        search,
        page,
        pageSize,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  }
);

// ADD PRODUCT//
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (productData) => {

    const token = localStorage.getItem("token");

    const res = await axios.post(
      BASE_URL,
      productData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  }
);

// DELETE PRODUCT//
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id) => {

    const token = localStorage.getItem("token");

    await axios.delete(
      `${BASE_URL}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return id;
  }
);

// UPDATE PRODUCT//

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, updatedData }) => {
    const token = localStorage.getItem("token");

    const res = await axios.put(
      `${BASE_URL}/${id}`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      ...res.data,
      id: id,
    };
  }
);

const productSlice = createSlice({
  name: "products",

 initialState: {
  items: [],
  loading: false,
  error: null,
  searchQuery: "",
  selectedProduct: null,

  totalCount: 0,
  currentPage: 1,
  pageSize: 4,
  totalPages: 0,
},

reducers: {

  setSearchQuery: (state, action) => {
    state.searchQuery = action.payload;
  },

  setCurrentPage: (state, action) => {
    state.currentPage = action.payload;
  },

  setSelectedProduct: (state, action) => {
    state.selectedProduct = action.payload;
  },

  clearSelectedProduct: (state) => {
    state.selectedProduct = null;
  },

},

  extraReducers: (builder) => {

    builder

      // FETCH PRODUCTS//
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

// FILTER PRODUCTS//
.addCase(fetchFilteredProducts.pending, (state) => {
  state.loading = true;
  state.error = null;
})

.addCase(fetchFilteredProducts.fulfilled, (state, action) => {
  state.loading = false;
  state.items = action.payload;
})

.addCase(fetchFilteredProducts.rejected, (state, action) => {
  state.loading = false;
  state.error = action.error.message;
})

// ADMIN PRODUCTS - SEARCH + PAGINATION
.addCase(fetchAdminProducts.pending, (state) => {
  state.loading = true;
  state.error = null;
})

.addCase(fetchAdminProducts.fulfilled, (state, action) => {
  state.loading = false;

  state.items = action.payload.products;
  state.totalCount = action.payload.totalCount;
  state.currentPage = action.payload.page;
  state.pageSize = action.payload.pageSize;
  state.totalPages = action.payload.totalPages;
})

.addCase(fetchAdminProducts.rejected, (state, action) => {
  state.loading = false;
  state.error = action.error.message;
})

      // ADD PRODUCT//
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })

      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })

      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })


      // DELETE PRODUCT
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;

        state.items = state.items.filter(
          (item) => item.id !== action.payload
        );
      })

      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })


      // UPDATE PRODUCT
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

  },
});


export const { setSearchQuery,setCurrentPage,setSelectedProduct,
  clearSelectedProduct, } = productSlice.actions;

export default productSlice.reducer;