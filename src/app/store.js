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
import authReducer, { clearError, saveAddress } from '../features/auth/authSlice';
import ordersReducer   from '../features/orders/ordersSlice';
import adminReducer    from '../features/admin/adminSlice';
import editModeReducer from '../features/editMode/editModeSlice';
import petReducer      from '../features/pets/petSlice';

import {
  addProduct, editProduct, deleteProduct,
  updateHeroSlide, deleteHeroSlide,
  updateCategory,
  addCategory, deleteCategory,
  updateWhyReason,
  addReview, editReview, deleteReview, toggleFeaturedReview,
  addEnquiry, updateEnquiryStatus, deleteEnquiry,
  updateContent,
} from '../features/admin/adminSlice';

import { resetProductStatus } from '../features/products/productSlice';

import {
  addToCart, removeFromCart, clearCart,
} from '../features/cart/cartSlice';

import { updateFields, updatePetMeasurements } from '../features/pets/petSlice';

import dataService from '../services/dataService';

// ── Listener Middleware ───────────────────────────────────────────────────
const listenerMiddleware = createListenerMiddleware();

// ── Auth: persist saved addresses ──────────────────────────────────
listenerMiddleware.startListening({
  actionCreator: saveAddress,
  effect: async (action, listenerApi) => {
    const { user } = listenerApi.getState().auth;
    if (user?.id) {
      await dataService.updateProfile(user.id, { savedAddresses: action.payload });
    }
  },
});

// ── Admin: persist products + reset public fetch status ─────────────────
listenerMiddleware.startListening({
  actionCreator: addProduct,
  effect: async (action, listenerApi) => {
    const result = await dataService.addProduct(action.payload);
    
    // If the API returned a real ID, we need to update our local state
    // so that future Edits or Deletes use the correct Database ID.
    if (result.success && result.data?.id) {
      listenerApi.dispatch(editProduct({ 
        id: action.payload.id, // The temporary 'p-...' ID
        newId: result.data.id  // The real database integer ID
      }));
    }
  },
});

listenerMiddleware.startListening({
  actionCreator: editProduct,
  effect: async (action) => {
    // ⚠️ IMPORTANT: Skip if this is just an ID sync from addProduct.
    // We don't want to call the API for a product that doesn't "exist" yet by ID.
    if (action.payload.newId) return;

    if (action.payload.id) {
      await dataService.updateProduct(action.payload.id, action.payload);
    }
  },
});

listenerMiddleware.startListening({
  actionCreator: deleteProduct,
  effect: async (action) => {
    await dataService.deleteProduct(action.payload);
  },
});

// Reset public fetch status after any admin product change
listenerMiddleware.startListening({
  matcher: isAnyOf(addProduct, editProduct, deleteProduct),
  effect: async (action, listenerApi) => {
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

// ── Admin: persist custom categories (add/delete) ─────────────────────
listenerMiddleware.startListening({
  actionCreator: addCategory,
  effect: async (action, listenerApi) => {
    // Only call API if payload is a string (initial creation)
    if (typeof action.payload !== 'string') return;

    const result = await dataService.addCategory(action.payload);
    
    // Sync the real database ID back to the local state
    if (result.success && result.data?.id) {
      const state = listenerApi.getState();
      // Find the temp cat we just added (it's at the end)
      const tempCat = state.admin.customCategories[state.admin.customCategories.length - 1];
      if (tempCat) {
        listenerApi.dispatch(addCategory({
          id: tempCat.id,
          newId: result.data.id
        }));
      }
    }
  },
});

listenerMiddleware.startListening({
  actionCreator: deleteCategory,
  effect: async (action) => {
    // Only call API if payload is NOT an object (handle real ID)
    if (typeof action.payload === 'object') return;
    await dataService.deleteCategory(action.payload);
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

// ── Pets: persist measurements when updated ───────────────────────────
listenerMiddleware.startListening({
  actionCreator: updatePetMeasurements,
  effect: async (action) => {
    const { userId, petId, measurements } = action.payload;
    await dataService.updatePet(userId, petId, { measurements });
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

// ── Auth: fetch data after login ────────────────────────────────────
listenerMiddleware.startListening({
  matcher: (action) => action.type === 'auth/login/fulfilled' || action.type === 'auth/register/fulfilled',
  effect: async (action, listenerApi) => {
    const { role, user } = listenerApi.getState().auth;
    
    // Always fetch pets and orders after login
    listenerApi.dispatch(fetchOrders());
    if (user?.id) {
      listenerApi.dispatch(fetchUserPets(user.id));
    }
    
    // If admin, fetch CMS data too
    if (role === 'admin' || role === 'superadmin') {
      listenerApi.dispatch(fetchAdminData());
    }
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
import { fetchPets, fetchUserPets } from '../features/pets/petSlice';

/**
 * bootstrapApp — call once in main.jsx after the store is created.
 * Loads all persisted state from the service layer.
 */
export const bootstrapApp = async () => {
  // 1. Restore auth session first
  const authResult = await store.dispatch(bootstrapAuth());
  const user = authResult.payload?.user;

  // 2. Fetch data based on auth status
  const tasks = [
    store.dispatch(fetchAdminData()),
    store.dispatch(hydrateCart()),
  ];

  if (user?.id) {
    tasks.push(store.dispatch(fetchOrders()));
    tasks.push(store.dispatch(fetchUserPets(user.id)));
    
    // Only call fetchPets (all users) for admins
    if (user.role === 'admin' || user.role === 'superadmin') {
      tasks.push(store.dispatch(fetchPets()));
    }
  }

  await Promise.all(tasks);
};
