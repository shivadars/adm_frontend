/**
 * ordersSlice.js
 *
 * Manages order state.
 * All persistence goes through dataService — no direct localStorage access.
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dataService from '../../services/dataService';

// ── Thunks ────────────────────────────────────────────────────────────────
export const fetchOrders = createAsyncThunk(
  'orders/fetchAll',
  async (_, { rejectWithValue }) => {
    const result = await dataService.getOrders();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const placeOrderAsync = createAsyncThunk(
  'orders/place',
  async (orderData, { rejectWithValue }) => {
    const result = await dataService.placeOrder(orderData);
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const updateOrderStatusAsync = createAsyncThunk(
  'orders/updateStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    const result = await dataService.updateOrderStatus(orderId, status);
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────
const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    status: 'idle',
    error:  null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // fetchOrders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.orders = payload;
      })
      .addCase(fetchOrders.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error  = payload || 'Failed to load orders.';
      });

    // placeOrderAsync
    builder
      .addCase(placeOrderAsync.fulfilled, (state, { payload }) => {
        state.orders.unshift(payload);
      })
      .addCase(placeOrderAsync.rejected, (state, { payload }) => {
        state.error = payload || 'Failed to place order.';
      });

    // updateOrderStatusAsync
    builder
      .addCase(updateOrderStatusAsync.fulfilled, (state, { payload }) => {
        const o = state.orders.find((o) => o.id === payload.id);
        if (o) o.status = payload.status;
      });
  },
});

// ── Backwards-compatible action aliases ───────────────────────────────────
// Components that still use dispatch(placeOrder(...)) or dispatch(updateOrderStatus(...))
// will continue to work via these aliases.
export const placeOrder         = placeOrderAsync;
export const updateOrderStatus  = updateOrderStatusAsync;

export default ordersSlice.reducer;
