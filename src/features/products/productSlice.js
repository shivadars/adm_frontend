/**
 * productSlice.js
 *
 * Manages the public product listing state (Shop page, Home page, etc.).
 * Uses dataService.getProducts() so it works with both localStorage and Laravel API.
 *
 * Admin product CRUD lives in adminSlice.js.
 * This slice is read-only — it only fetches products for display.
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dataService from '../../services/dataService';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params, { rejectWithValue }) => {
    const result = await dataService.getProducts(params || {});
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

const initialState = {
  items:  [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error:  null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Reset status so fetchProducts can re-run (e.g. after admin adds a product)
    resetProductStatus: (state) => {
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error  = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items  = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error  = action.payload || 'Failed to fetch products';
      });
  },
});

export const { resetProductStatus } = productSlice.actions;
export default productSlice.reducer;
