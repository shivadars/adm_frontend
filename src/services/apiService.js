/**
 * apiService.js
 *
 * Handles ALL data access via Laravel REST API (Sanctum / JWT).
 * Every method is async and returns a standardised response:
 *   { success: true,  data: <payload> }
 *   { success: false, error: <message> }
 *
 * This is the "api" implementation of the service contract.
 * Method signatures are IDENTICAL to localService.js.
 *
 * Switch between implementations by setting:
 *   VITE_DATA_SOURCE=api   (this file)
 *   VITE_DATA_SOURCE=local (localService.js)
 */

import axiosInstance, { TOKEN_KEY } from './axiosInstance';
import { ENDPOINTS } from './endpoints';

// ── Helper ──────────────────────────────────────────────────────────────────
const ok  = (data)  => ({ success: true,  data });
const err = (msg)   => ({ success: false, error: msg });

/**
 * Unwraps an Axios response into our standard shape.
 * Laravel typically returns { data: {...}, message: '...' }
 */
const unwrap = (response) => {
  const payload = response.data;
  // Support both { data: ... } and flat responses
  return ok(payload?.data ?? payload);
};

const handleError = (e) => {
  const message =
    e.response?.data?.message ||
    e.response?.data?.error ||
    e.message ||
    'An unexpected error occurred.';
  return err(message);
};

// ── Pet Mapping Helpers ──────────────────────────────────────────────────────
const mapPetFromBackend = (pet) => {
  if (!pet) return pet;
  return {
    ...pet,
    // Map base fields if needed, but ensure they don't clash
    photo: pet.image,
    instagram: pet.instagram_username,
    measurements: {
      size: pet.size,
      neckLength: pet.neck_length,
      chestLength: pet.chest_length,
      backLength: pet.back_length,
      topToToeHeight: pet.top_to_toe_height,
    }
  };
};

const mapPetToBackend = (petOrUpdates) => {
  if (!petOrUpdates) return petOrUpdates;
  const data = { ...petOrUpdates };
  
  // Base field mapping
  if (data.photo) data.image = data.photo;
  if (data.instagram) data.instagram_username = data.instagram;
  
  // Flatten measurements
  if (data.measurements) {
    const m = data.measurements;
    if (m.size !== undefined) data.size = m.size;
    if (m.neckLength !== undefined) data.neck_length = m.neckLength;
    if (m.chestLength !== undefined) data.chest_length = m.chestLength;
    if (m.backLength !== undefined) data.back_length = m.backLength;
    if (m.topToToeHeight !== undefined) data.top_to_toe_height = m.topToToeHeight;
    delete data.measurements;
  }
  
  // Individual field mapping (in case they are passed at top level)
  if (data.neckLength !== undefined) { data.neck_length = data.neckLength; delete data.neckLength; }
  if (data.chestLength !== undefined) { data.chest_length = data.chestLength; delete data.chestLength; }
  if (data.backLength !== undefined) { data.back_length = data.backLength; delete data.backLength; }
  if (data.topToToeHeight !== undefined) { data.top_to_toe_height = data.topToToeHeight; delete data.topToToeHeight; }

  return data;
};

// ── Auth ─────────────────────────────────────────────────────────────────────
export const login = async ({ email, password }) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.LOGIN, { email, password });
    const payload = response.data;
    const token = payload?.token || payload?.data?.token;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    // Normalise to { user, role } shape (same as localService)
    const user = payload?.user || payload?.data?.user || payload?.data;
    const role = user?.role || 'customer';
    const session = { user, role };
    return ok(session);
  } catch (e) {
    return handleError(e);
  }
};

export const logout = async () => {
  try {
    await axiosInstance.post(ENDPOINTS.LOGOUT);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('adoremom_session');
    return ok(null);
  } catch (e) {
    // Even if the API call fails, clear local token
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('adoremom_session');
    return ok(null);
  }
};

export const register = async (userData) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.REGISTER, userData);
    const payload = response.data;
    const token = payload?.token || payload?.data?.token;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    const user = payload?.user || payload?.data?.user || payload?.data;
    const role = user?.role || 'customer';
    return ok({ user, role });
  } catch (e) {
    return handleError(e);
  }
};

export const getSession = async () => {
  try {
    // Validate token by fetching the authenticated user
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return ok(null);
    const response = await axiosInstance.get('/user'); // Laravel Sanctum default
    const user = response.data?.data || response.data;
    return ok({ user, role: user?.role || 'customer' });
  } catch {
    // Token invalid — clear it
    localStorage.removeItem(TOKEN_KEY);
    return ok(null);
  }
};

// ── Users ────────────────────────────────────────────────────────────────────
export const getUsers = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.USERS);
    return unwrap(response);
  } catch (e) {
    return handleError(e);
  }
};

export const addUser = async (user) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.USERS, user);
    return unwrap(response);
  } catch (e) {
    return handleError(e);
  }
};

export const updateProfile = async (id, data) => {
  try {
    const response = await axiosInstance.put(ENDPOINTS.USER(id), data);
    return unwrap(response);
  } catch (e) {
    return handleError(e);
  }
};

// ── Products ─────────────────────────────────────────────────────────────────
export const getProducts = async (params = {}) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.PUBLIC_PRODUCTS, { params });
    return unwrap(response);
  } catch (e) {
    return handleError(e);
  }
};

export const addProduct = async (product) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.PRODUCTS, product);
    return unwrap(response);
  } catch (e) {
    return handleError(e);
  }
};

export const updateProduct = async (id, data) => {
  try {
    const response = await axiosInstance.put(ENDPOINTS.PRODUCT(id), data);
    return unwrap(response);
  } catch (e) {
    return handleError(e);
  }
};

export const deleteProduct = async (id) => {
  try {
    await axiosInstance.delete(ENDPOINTS.PRODUCT(id));
    return ok({ id });
  } catch (e) {
    return handleError(e);
  }
};

// ── Cart ─────────────────────────────────────────────────────────────────────
export const getCart = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.CART);
    return unwrap(response);
  } catch (e) {
    return handleError(e);
  }
};

export const saveCart = async (cartItems) => {
  try {
    // Laravel: POST /api/cart with the full cart array (or sync endpoint)
    const response = await axiosInstance.post(ENDPOINTS.CART, { items: cartItems });
    return unwrap(response);
  } catch (e) {
    return handleError(e);
  }
};

export const clearCart = async () => {
  try {
    await axiosInstance.delete(ENDPOINTS.CART);
    return ok([]);
  } catch (e) {
    return handleError(e);
  }
};

// ── Orders ───────────────────────────────────────────────────────────────────
export const getOrders = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ORDERS);
    return unwrap(response);
  } catch (e) {
    return handleError(e);
  }
};

export const placeOrder = async (orderData) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.ORDERS, orderData);
    return unwrap(response);
  } catch (e) {
    return handleError(e);
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axiosInstance.put(ENDPOINTS.ORDER(orderId), { status });
    return unwrap(response);
  } catch (e) {
    return handleError(e);
  }
};

// ── Pets ─────────────────────────────────────────────────────────────────────
export const getPets = async (userId) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.PETS(userId));
    const result = unwrap(response);
    if (result.success && Array.isArray(result.data)) {
      result.data = result.data.map(mapPetFromBackend);
    }
    return result;
  } catch (e) {
    return handleError(e);
  }
};

export const getAllPets = async () => {
  try {
    // Admin-level endpoint to get all pets
    const response = await axiosInstance.get('/pets');
    const result = unwrap(response);
    if (result.success) {
      if (Array.isArray(result.data)) {
        result.data = result.data.map(mapPetFromBackend);
      } else if (typeof result.data === 'object') {
        // Map pets in { userId: [pets] } object
        Object.keys(result.data).forEach(uid => {
          if (Array.isArray(result.data[uid])) {
            result.data[uid] = result.data[uid].map(mapPetFromBackend);
          }
        });
      }
    }
    return result;
  } catch (e) {
    return handleError(e);
  }
};

export const addPet = async (userId, pet) => {
  try {
    const data = mapPetToBackend(pet);
    const response = await axiosInstance.post(ENDPOINTS.PETS(userId), data);
    const result = unwrap(response);
    if (result.success) {
      result.data = mapPetFromBackend(result.data);
    }
    return result;
  } catch (e) {
    return handleError(e);
  }
};

export const updatePet = async (userId, petId, updates) => {
  try {
    const data = mapPetToBackend(updates);
    const response = await axiosInstance.put(ENDPOINTS.PET(petId), data);
    const result = unwrap(response);
    if (result.success) {
      result.data = mapPetFromBackend(result.data);
    }
    return result;
  } catch (e) {
    return handleError(e);
  }
};

export const deletePet = async (userId, petId) => {
  try {
    await axiosInstance.delete(ENDPOINTS.PET(petId));
    return ok({ petId });
  } catch (e) {
    return handleError(e);
  }
};

// ── Admin / CMS ──────────────────────────────────────────────────────────────
export const getAdminData = async (key) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN_DATA(key));
    return unwrap(response);
  } catch (e) {
    return handleError(e);
  }
};

export const getAdminDashboard = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN_DASHBOARD);
    return unwrap(response);
  } catch (e) {
    return handleError(e);
  }
};

export const setAdminData = async (key, value) => {
  try {
    const response = await axiosInstance.put(ENDPOINTS.ADMIN_DATA(key), { data: value });
    return unwrap(response);
  } catch (e) {
    return handleError(e);
  }
};

// ── Named export object (matches localService shape) ──────────────────────
const apiService = {
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
  savePets: async () => ok(null), // Compatibility no-op
  // Admin CMS
  getAdminData,
  getAdminDashboard,
  setAdminData,
};

export default apiService;
