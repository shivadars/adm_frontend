import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
  isCartOpen: false,
};

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
        (item) => item.id === product.id && item.size === size
      );

      if (existingIndex >= 0) {
        state.cartItems[existingIndex].cartQty += quantity;
      } else {
        const item = { ...product, cartQty: quantity, size };
        state.cartItems.push(item);
      }
      state.cartTotalQuantity += quantity;
    },
    removeFromCart(state, action) {
      const { id, size } = action.payload;
      const existingItem = state.cartItems.find(item => item.id === id && item.size === size);
      
      if(existingItem) {
        state.cartTotalQuantity -= existingItem.cartQty;
        state.cartItems = state.cartItems.filter(
          item => !(item.id === id && item.size === size)
        );
      }
    },
    getCartTotal(state) {
      let total = 0;
      state.cartItems.forEach(item => {
        total += item.price * item.cartQty;
      });
      state.cartTotalAmount = total;
    },
    clearCart(state) {
      state.cartItems = [];
      state.cartTotalQuantity = 0;
      state.cartTotalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, getCartTotal, toggleCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
