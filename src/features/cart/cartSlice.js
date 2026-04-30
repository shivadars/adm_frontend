/**
 * cartSlice.js
 *
 * Cart state management.
 * - Cart operations (add, remove, clear) are synchronous for instant UI feedback.
 * - Cart is persisted via the RTK listener middleware (see store.js) which
 *   calls dataService.saveCart() after every mutation.
 * - hydrateCart thunk loads the persisted cart at app startup.
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dataService from '../../services/dataService';

// ── Hydrate thunk: load cart from service on app startup ─────────────────
export const hydrateCart = createAsyncThunk(
  'cart/hydrate',
  async (_, { rejectWithValue }) => {
    const result = await dataService.getCart();
    if (!result.success) return rejectWithValue(result.error);
    return result.data || [];
  }
);

// ── Initial state ─────────────────────────────────────────────────────────
const initialState = {
  cartItems:         [],
  cartTotalQuantity: 0,
  cartTotalAmount:   0,
  isCartOpen:        false,
};

// ── Helpers ───────────────────────────────────────────────────────────────
const recalcTotals = (state) => {
  state.cartTotalQuantity = state.cartItems.reduce((sum, item) => sum + item.cartQty, 0);
  state.cartTotalAmount   = state.cartItems.reduce((sum, item) => sum + item.price * item.cartQty, 0);
};

// ── Slice ─────────────────────────────────────────────────────────────────
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    toggleCart(state, action) {
      state.isCartOpen = action.payload !== undefined ? action.payload : !state.isCartOpen;
    },

    addToCart(state, action) {
      const { product, quantity, size } = action.payload;
      const existingIndex = state.cartItems.findIndex(
        (item) => String(item.id) === String(product.id) && item.size === size
      );
      if (existingIndex >= 0) {
        state.cartItems[existingIndex].cartQty += quantity;
      } else {
        state.cartItems.push({ ...product, cartQty: quantity, size });
      }
      recalcTotals(state);
    },

    removeFromCart(state, action) {
      const { id, size } = action.payload;
      // Use loose matching or string conversion to handle potential string/number mismatch from DB
      state.cartItems = state.cartItems.filter(
        (item) => !(String(item.id) === String(id) && item.size === size)
      );
      recalcTotals(state);
    },

    // Kept for backwards compatibility — now recalc happens automatically
    getCartTotal(state) {
      recalcTotals(state);
    },

    clearCart(state) {
      state.cartItems         = [];
      state.cartTotalQuantity = 0;
      state.cartTotalAmount   = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load cart from DB
      .addCase(hydrateCart.fulfilled, (state, { payload }) => {
        state.cartItems = payload || [];
        recalcTotals(state);
      })
      // RESET CART on logout — critical for multi-user security
      .addMatcher(
        (action) => action.type === 'auth/logout/fulfilled',
        (state) => {
          state.cartItems = [];
          state.cartTotalQuantity = 0;
          state.cartTotalAmount = 0;
        }
      );
  },
});

export const { addToCart, removeFromCart, getCartTotal, toggleCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
