/**
 * localService.js
 *
 * Handles ALL data access using localStorage.
 * Every method is async and returns a standardised response:
 *   { success: true,  data: <payload> }
 *   { success: false, error: <message> }
 *
 * This is the "local" implementation of the service contract.
 * It must stay in sync with apiService.js — identical method signatures.
 */

import { mockProducts, mockCategories } from './apiMockData';

// ── Storage keys ────────────────────────────────────────────────────────────
const KEYS = {
  USERS:      'adoremom_users',
  SESSION:    'adoremom_session',
  PRODUCTS:   'adoremom_products',
  CART:       'adoremom_cart',
  ORDERS:     'adoremom_orders',
  PETS:       'adoremom_pets',
  PET_FIELDS: 'adoremom_pet_fields',
  TOKEN:      'adoremom_token',      // kept for API-mode parity, unused in local
  // Admin CMS keys
  HERO:       'adoremom_hero',
  CATEGORIES: 'adoremom_categories',
  CONTENT:    'adoremom_content',
  REVIEWS:    'adoremom_reviews',
  WHY:        'adoremom_why',
  ENQUIRIES:  'adoremom_enquiries',
};

// ── Seed data ────────────────────────────────────────────────────────────────
const SEED_USERS = [
  {
    id: 'admin-1',
    name: 'Admin',
    email: 'admin@adoremom.in',
    password: 'admin123',
    role: 'admin',
    phone: '+91 98765 43210',
    address: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cust-1',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'demo123',
    role: 'customer',
    phone: '+91 99887 76655',
    address: '12, Rose Street, Bengaluru',
    createdAt: new Date().toISOString(),
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const read = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* storage full — silently ignore */ }
};

const ok  = (data)  => ({ success: true,  data });
const err = (msg)   => ({ success: false, error: msg });

// ── Auth ─────────────────────────────────────────────────────────────────────
export const login = async ({ email, password }) => {
  try {
    const users = read(KEYS.USERS, SEED_USERS);
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );
    if (!found) return err('Invalid email or password. Please try again.');

    const { password: _pw, ...safe } = found;
    const session = { user: safe, role: found.role };
    write(KEYS.SESSION, session);
    return ok(session);
  } catch (e) {
    return err(e.message);
  }
};

export const logout = async () => {
  try {
    localStorage.removeItem(KEYS.SESSION);
    localStorage.removeItem(KEYS.TOKEN);
    return ok(null);
  } catch (e) {
    return err(e.message);
  }
};

export const register = async (userData) => {
  try {
    const users = read(KEYS.USERS, SEED_USERS);
    const exists = users.find(
      (u) => u.email.toLowerCase() === userData.email.toLowerCase()
    );
    if (exists) return err('An account with this email already exists.');

    const newUser = {
      id: `cust-${Date.now()}`,
      ...userData,
      role: 'customer',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    write(KEYS.USERS, users);

    const { password: _pw, ...safe } = newUser;
    const session = { user: safe, role: 'customer' };
    write(KEYS.SESSION, session);
    return ok(session);
  } catch (e) {
    return err(e.message);
  }
};

export const getSession = async () => {
  try {
    const session = read(KEYS.SESSION, null);
    return ok(session);
  } catch (e) {
    return err(e.message);
  }
};

// ── Users ────────────────────────────────────────────────────────────────────
export const getUsers = async () => {
  try {
    const users = read(KEYS.USERS, SEED_USERS);
    // Never expose passwords
    const safe = users.map(({ password: _pw, ...u }) => u);
    return ok(safe);
  } catch (e) {
    return err(e.message);
  }
};

export const addUser = async (user) => {
  try {
    const users = read(KEYS.USERS, SEED_USERS);
    const newUser = { id: `cust-${Date.now()}`, ...user, createdAt: new Date().toISOString() };
    users.push(newUser);
    write(KEYS.USERS, users);
    const { password: _pw, ...safe } = newUser;
    return ok(safe);
  } catch (e) {
    return err(e.message);
  }
};

export const updateProfile = async (id, data) => {
  try {
    const users = read(KEYS.USERS, SEED_USERS);
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return err('User not found.');
    users[idx] = { ...users[idx], ...data };
    write(KEYS.USERS, users);

    // Update active session
    const session = read(KEYS.SESSION, null);
    if (session?.user?.id === id) {
      const { password: _pw, ...safe } = users[idx];
      session.user = safe;
      write(KEYS.SESSION, session);
    }

    const { password: _pw, ...safe } = users[idx];
    return ok(safe);
  } catch (e) {
    return err(e.message);
  }
};

// ── Products ─────────────────────────────────────────────────────────────────
export const getProducts = async (params = {}) => {
  try {
    let products = read(KEYS.PRODUCTS, mockProducts);

    // Auto-migrate legacy data
    if (Array.isArray(products)) {
      products.forEach((p) => {
        if (!p.id) p.id = `p-${Date.now()}-${Math.random()}`;
      });
    }

    if (params.category) {
      const cat = params.category.toLowerCase().replace(/-/g, ' ');
      products = products.filter(
        (p) =>
          p.category?.toLowerCase() === cat ||
          p.category?.toLowerCase().replace(/-/g, ' ') === cat
      );
    }
    if (params.search) {
      products = products.filter((p) =>
        p.name?.toLowerCase().includes(params.search.toLowerCase())
      );
    }
    return ok(products);
  } catch (e) {
    return err(e.message);
  }
};

export const addProduct = async (product) => {
  try {
    const products = read(KEYS.PRODUCTS, mockProducts);
    const newProduct = { id: `p-${Date.now()}`, ...product };
    products.push(newProduct);
    write(KEYS.PRODUCTS, products);
    return ok(newProduct);
  } catch (e) {
    return err(e.message);
  }
};

export const updateProduct = async (id, data) => {
  try {
    const products = read(KEYS.PRODUCTS, mockProducts);
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return err('Product not found.');
    products[idx] = { ...products[idx], ...data, id };
    write(KEYS.PRODUCTS, products);
    return ok(products[idx]);
  } catch (e) {
    return err(e.message);
  }
};

export const deleteProduct = async (id) => {
  try {
    let products = read(KEYS.PRODUCTS, mockProducts);
    products = products.filter((p) => p.id !== id);
    write(KEYS.PRODUCTS, products);
    return ok({ id });
  } catch (e) {
    return err(e.message);
  }
};

// ── Cart ─────────────────────────────────────────────────────────────────────
export const getCart = async () => {
  try {
    return ok(read(KEYS.CART, []));
  } catch (e) {
    return err(e.message);
  }
};

export const saveCart = async (cartItems) => {
  try {
    write(KEYS.CART, cartItems);
    return ok(cartItems);
  } catch (e) {
    return err(e.message);
  }
};

export const clearCart = async () => {
  try {
    write(KEYS.CART, []);
    return ok([]);
  } catch (e) {
    return err(e.message);
  }
};

// ── Orders ───────────────────────────────────────────────────────────────────
export const getOrders = async () => {
  try {
    return ok(read(KEYS.ORDERS, []));
  } catch (e) {
    return err(e.message);
  }
};

export const placeOrder = async (orderData) => {
  try {
    const orders = read(KEYS.ORDERS, []);
    const order = {
      id: `ORD-${Date.now()}`,
      ...orderData,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    orders.unshift(order);
    write(KEYS.ORDERS, orders);
    return ok(order);
  } catch (e) {
    return err(e.message);
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const orders = read(KEYS.ORDERS, []);
    const order = orders.find((o) => o.id === orderId);
    if (!order) return err('Order not found.');
    order.status = status;
    write(KEYS.ORDERS, orders);
    return ok(order);
  } catch (e) {
    return err(e.message);
  }
};

// ── Pets ─────────────────────────────────────────────────────────────────────
export const getPets = async (userId) => {
  try {
    const all = read(KEYS.PETS, {});
    return ok(all[userId] || []);
  } catch (e) {
    return err(e.message);
  }
};

export const getAllPets = async () => {
  try {
    return ok(read(KEYS.PETS, {}));
  } catch (e) {
    return err(e.message);
  }
};

export const addPet = async (userId, pet) => {
  try {
    const all = read(KEYS.PETS, {});
    if (!all[userId]) all[userId] = [];
    const newPet = { ...pet, id: `pet_${Date.now()}`, createdAt: new Date().toISOString() };
    all[userId].push(newPet);
    write(KEYS.PETS, all);
    return ok(newPet);
  } catch (e) {
    return err(e.message);
  }
};

export const updatePet = async (userId, petId, updates) => {
  try {
    const all = read(KEYS.PETS, {});
    if (!all[userId]) return err('No pets found for this user.');
    all[userId] = all[userId].map((p) =>
      p.id === petId ? { ...p, ...updates } : p
    );
    write(KEYS.PETS, all);
    const updated = all[userId].find((p) => p.id === petId);
    return ok(updated);
  } catch (e) {
    return err(e.message);
  }
};

export const deletePet = async (userId, petId) => {
  try {
    const all = read(KEYS.PETS, {});
    if (!all[userId]) return err('No pets found for this user.');
    all[userId] = all[userId].filter((p) => p.id !== petId);
    write(KEYS.PETS, all);
    return ok({ petId });
  } catch (e) {
    return err(e.message);
  }
};

// ── Admin / CMS ──────────────────────────────────────────────────────────────
const ADMIN_KEY_MAP = {
  hero:       KEYS.HERO,
  categories: KEYS.CATEGORIES,
  content:    KEYS.CONTENT,
  reviews:    KEYS.REVIEWS,
  why:        KEYS.WHY,
  enquiries:  KEYS.ENQUIRIES,
  products:   KEYS.PRODUCTS,
};

export const getAdminData = async (key) => {
  try {
    const storageKey = ADMIN_KEY_MAP[key];
    if (!storageKey) return err(`Unknown admin data key: ${key}`);
    const data = read(storageKey, null);
    return ok(data);
  } catch (e) {
    return err(e.message);
  }
};

export const setAdminData = async (key, value) => {
  try {
    const storageKey = ADMIN_KEY_MAP[key];
    if (!storageKey) return err(`Unknown admin data key: ${key}`);
    write(storageKey, value);
    return ok(value);
  } catch (e) {
    return err(e.message);
  }
};

// ── Named export object (matches apiService shape) ────────────────────────
const localService = {
  // Auth
  login,
  logout,
  register,
  getSession,
  // Users
  getUsers,
  addUser,
  updateProfile,
  // Products
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  // Cart
  getCart,
  saveCart,
  clearCart,
  // Orders
  getOrders,
  placeOrder,
  updateOrderStatus,
  // Pets
  getPets,
  getAllPets,
  addPet,
  updatePet,
  deletePet,
  // Admin CMS
  getAdminData,
  setAdminData,
};

export default localService;
