import { createSlice } from '@reduxjs/toolkit';

// ── Seed data ─────────────────────────────────────────────────────────────────
const SEED_USERS = [
  {
    id: 'admin-1',
    name: "Admin",
    email: "admin@adoremom.in",
    password: "admin123",
    role: "admin",
    phone: "+91 98765 43210",
    address: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cust-1',
    name: "Priya Sharma",
    email: "priya@example.com",
    password: "demo123",
    role: "customer",
    phone: "+91 99887 76655",
    address: "12, Rose Street, Bengaluru",
    createdAt: new Date().toISOString(),
  },
];

const loadUsers = () => {
  try {
    const stored = localStorage.getItem('adoremom_users');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('adoremom_users', JSON.stringify(SEED_USERS));
    return SEED_USERS;
  } catch { return SEED_USERS; }
};

const saveUsers = (users) => {
  try { localStorage.setItem('adoremom_users', JSON.stringify(users)); } catch {}
};

const loadSession = () => {
  try {
    const s = localStorage.getItem('adoremom_session');
    return s ? JSON.parse(s) : null;
  } catch { return null; }
};

// ── Initial state ─────────────────────────────────────────────────────────────
const session = loadSession();
const initialState = {
  user: session?.user || null,
  role: session?.role || 'guest',
  isAuthenticated: !!session,
  users: loadUsers(),
  error: null,
};

// ── Slice ──────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, { payload: { email, password } }) => {
      const found = state.users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (!found) {
        state.error = 'Invalid email or password. Please try again.';
        return;
      }
      const { password: _, ...safe } = found;
      state.user = safe;
      state.role = found.role;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('adoremom_session', JSON.stringify({ user: safe, role: found.role }));
    },

    logout: (state) => {
      state.user = null;
      state.role = 'guest';
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('adoremom_session');
    },

    register: (state, { payload }) => {
      const exists = state.users.find(u => u.email.toLowerCase() === payload.email.toLowerCase());
      if (exists) {
        state.error = 'An account with this email already exists.';
        return;
      }
      const newUser = {
        id: `cust-${Date.now()}`,
        ...payload,
        role: 'customer',
        createdAt: new Date().toISOString(),
      };
      state.users.push(newUser);
      saveUsers(state.users);

      const { password: _, ...safe } = newUser;
      state.user = safe;
      state.role = 'customer';
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('adoremom_session', JSON.stringify({ user: safe, role: 'customer' }));
    },

    updateProfile: (state, { payload }) => {
      const idx = state.users.findIndex(u => u.id === state.user?.id);
      if (idx === -1) return;
      state.users[idx] = { ...state.users[idx], ...payload };
      saveUsers(state.users);
      state.user = { ...state.user, ...payload };
      const session = JSON.parse(localStorage.getItem('adoremom_session') || '{}');
      localStorage.setItem('adoremom_session', JSON.stringify({ ...session, user: state.user }));
    },

    clearError: (state) => { state.error = null; },
  },
});

export const { login, logout, register, updateProfile, clearError } = authSlice.actions;
export default authSlice.reducer;
