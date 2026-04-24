/**
 * axiosInstance.js
 *
 * Real Axios instance used by apiService.js when VITE_DATA_SOURCE=api.
 * - Reads VITE_API_URL for the base URL
 * - Attaches Authorization: Bearer <token> on every request
 * - Handles 401 responses by clearing the stored token
 */
import axios from 'axios';

const TOKEN_KEY = 'adoremom_token';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false, // Set to false because we use Bearer token auth, not cookie auth
});

// ── Request interceptor: attach Bearer token ──────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 / token expiry ──────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear stored credentials
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('adoremom_session');
      // Optionally redirect to /login — avoid hard dependency on router here
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }
    return Promise.reject(error);
  }
);

export { TOKEN_KEY };
export default axiosInstance;
