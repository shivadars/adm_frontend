// All API endpoint constants used by apiService.js
// Base URL is controlled by VITE_API_URL environment variable

export const ENDPOINTS = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  LOGIN:    '/login',
  LOGOUT:   '/logout',
  REGISTER: '/register',

  // ── Users ─────────────────────────────────────────────────────────────────
  USERS:       '/users',
  USER:        (id) => `/users/${id}`,

  // ── Products ──────────────────────────────────────────────────────────────
  PRODUCTS:    '/products',
  PRODUCT:     (id) => `/products/${id}`,

  // ── Cart ──────────────────────────────────────────────────────────────────
  CART:        '/cart',
  CART_ITEM:   (id) => `/cart/${id}`,

  // ── Orders ────────────────────────────────────────────────────────────────
  ORDERS:      '/orders',
  ORDER:       (id) => `/orders/${id}`,

  // ── Pets ──────────────────────────────────────────────────────────────────
  PETS:        (userId) => `/pets/${userId}`,
  PET:         (id) => `/pets/${id}`,

  // ── Admin / CMS ───────────────────────────────────────────────────────────
  ADMIN_DATA:  (key) => `/admin/${key}`,

  // ── Categories ────────────────────────────────────────────────────────────
  CATEGORIES:  '/categories',
};
