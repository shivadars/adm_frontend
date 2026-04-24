/**
 * store.js
 *
 * Redux store with RTK Listener Middleware.
 *
 * The listener middleware watches for admin and cart slice mutations
 * and persists changes via dataService automatically — keeping components
 * completely free of any persistence logic.
 *
 * App bootstrap sequence:
 *   1. bootstrapAuth  — restore session
 *   2. fetchAdminData — load all CMS data (products, hero, reviews, etc.)
 *   3. fetchOrders    — load user orders
 *   4. hydrateCart    — restore cart items
 *   5. fetchPets      — load pet profiles
 */
import { configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import cartReducer     from '../features/cart/cartSlice';
import productReducer  from '../features/products/productSlice';
import authReducer     from '../features/auth/authSlice';
import ordersReducer   from '../features/orders/ordersSlice';
import adminReducer    from '../features/admin/adminSlice';
import editModeReducer from '../features/editMode/editModeSlice';
import petReducer      from '../features/pets/petSlice';

import {
  addProduct, editProduct, deleteProduct,
  updateHeroSlide, deleteHeroSlide,
  updateCategory,
  updateWhyReason,
  addReview, editReview, deleteReview, toggleFeaturedReview,
  addEnquiry, updateEnquiryStatus, deleteEnquiry,
  updateContent,
} from '../features/admin/adminSlice';

import { resetProductStatus } from '../features/products/productSlice';

import {
  addToCart, removeFromCart, clearCart,
} from '../features/cart/cartSlice';

import { updateFields } from '../features/pets/petSlice';

import dataService from '../services/dataService';

// ── Listener Middleware ───────────────────────────────────────────────────
const listenerMiddleware = createListenerMiddleware();

// ── Admin: persist products + reset public fetch status ─────────────────
// After any product CRUD, save to storage AND reset state.products.status
// so the Shop page's useEffect re-triggers fetchProducts automatically.
listenerMiddleware.startListening({
  matcher: isAnyOf(addProduct, editProduct, deleteProduct),
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState();
    await dataService.setAdminData('products', state.admin.products);
    // Reset so Shop re-fetches the updated list
    listenerApi.dispatch(resetProductStatus());
  },
});

// ── Admin: persist hero slides ────────────────────────────────────────────
listenerMiddleware.startListening({
  matcher: isAnyOf(updateHeroSlide, deleteHeroSlide),
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState();
    await dataService.setAdminData('hero', state.admin.heroSlides);
  },
});

// ── Admin: persist categories ─────────────────────────────────────────────
listenerMiddleware.startListening({
  actionCreator: updateCategory,
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState();
    await dataService.setAdminData('categories', state.admin.categories);
  },
});

// ── Admin: persist Why Choose Us ──────────────────────────────────────────
listenerMiddleware.startListening({
  actionCreator: updateWhyReason,
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState();
    await dataService.setAdminData('why', state.admin.whyChooseUs);
  },
});

// ── Admin: persist reviews ────────────────────────────────────────────────
listenerMiddleware.startListening({
  matcher: isAnyOf(addReview, editReview, deleteReview, toggleFeaturedReview),
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState();
    await dataService.setAdminData('reviews', state.admin.reviews);
  },
});

// ── Admin: persist enquiries ──────────────────────────────────────────────
listenerMiddleware.startListening({
  matcher: isAnyOf(addEnquiry, updateEnquiryStatus, deleteEnquiry),
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState();
    await dataService.setAdminData('enquiries', state.admin.enquiries);
  },
});

// ── Admin: persist content ────────────────────────────────────────────────
listenerMiddleware.startListening({
  actionCreator: updateContent,
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState();
    await dataService.setAdminData('content', state.admin.content);
  },
});

// ── Cart: persist after every cart mutation ───────────────────────────────
listenerMiddleware.startListening({
  matcher: isAnyOf(addToCart, removeFromCart, clearCart),
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState();
    await dataService.saveCart(state.cart.cartItems);
  },
});

// ── Pets: persist fields when admin changes them ──────────────────────────
listenerMiddleware.startListening({
  actionCreator: updateFields,
  effect: async (action) => {
    // petFields are local-only admin config; save directly
    await dataService.setAdminData('pet_fields', action.payload);
  },
});

// ── Store ────────────────────────────────────────────────────────────────
export const store = configureStore({
  reducer: {
    cart:     cartReducer,
    products: productReducer,
    auth:     authReducer,
    orders:   ordersReducer,
    admin:    adminReducer,
    editMode: editModeReducer,
    pets:     petReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

// ── App Bootstrap ─────────────────────────────────────────────────────────
// Import thunks here to avoid circular dependency issues
import { bootstrapAuth }  from '../features/auth/authSlice';
import { fetchAdminData } from '../features/admin/adminSlice';
import { fetchOrders }    from '../features/orders/ordersSlice';
import { hydrateCart }    from '../features/cart/cartSlice';
import { fetchPets }      from '../features/pets/petSlice';

/**
 * bootstrapApp — call once in main.jsx after the store is created.
 * Loads all persisted state from the service layer.
 */
export const bootstrapApp = async () => {
  await store.dispatch(bootstrapAuth());
  await Promise.all([
    store.dispatch(fetchAdminData()),
    store.dispatch(fetchOrders()),
    store.dispatch(hydrateCart()),
    store.dispatch(fetchPets()),
  ]);
};
