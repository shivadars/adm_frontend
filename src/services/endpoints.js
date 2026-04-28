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
  PRODUCTS:    '/superadmin/products',
  PRODUCT:     (id) => `/superadmin/products/${id}`,
  PUBLIC_PRODUCTS: '/products',

  // ── Cart ──────────────────────────────────────────────────────────────────
  CART:        '/cart',
  CART_ITEM:   (id) => `/cart/${id}`,

  // ── Orders ────────────────────────────────────────────────────────────────
  ORDERS:      '/orders',
  ORDER:       (id) => `/orders/${id}`,
  SUPERADMIN_ORDERS: '/superadmin/orders',
  SUPERADMIN_ORDER: (id) => `/superadmin/orders/${id}`,

  // ── Pets ──────────────────────────────────────────────────────────────────
  PETS:        (userId) => `/pets`,
  PET:         (id) => `/pets/${id}`,

  // ── Admin / CMS ───────────────────────────────────────────────────────────
  ADMIN_DATA:       (key) => `/superadmin/${key}`,
  ADMIN_DASHBOARD:  '/superadmin/dashboard',

  // ── Addresses ─────────────────────────────────────────────────────────────
  ADDRESSES:   '/addresses',
  ADDRESS:     (id) => `/addresses/${id}`,

  // ── Categories ────────────────────────────────────────────────────────────
  CATEGORIES:  '/categories',
  SUPERADMIN_CATEGORIES: '/superadmin/categories',
  SUPERADMIN_CATEGORY: (id) => `/superadmin/categories/${id}`,
};
