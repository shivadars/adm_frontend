/**
 * authSlice.js
 *
 * Manages authentication state.
 * All async operations go through dataService — no direct localStorage access.
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dataService from '../../services/dataService';

// ── Bootstrap: load session once from service at app start ────────────────
export const bootstrapAuth = createAsyncThunk(
  'auth/bootstrap',
  async (_, { rejectWithValue }) => {
    const result = await dataService.getSession();
    if (!result.success) return rejectWithValue(result.error);
    return result.data; // { user, role } or null
  }
);

// ── Thunks ────────────────────────────────────────────────────────────────
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    const result = await dataService.login(credentials);
    if (!result.success) return rejectWithValue(result.error);
    return result.data; // { user, role }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    const result = await dataService.logout();
    if (!result.success) return rejectWithValue(result.error);
    return null;
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    const result = await dataService.register(userData);
    if (!result.success) return rejectWithValue(result.error);
    return result.data; // { user, role }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ id, data }, { rejectWithValue }) => {
    const result = await dataService.updateProfile(id, data);
    if (!result.success) return rejectWithValue(result.error);
    return result.data; // updated user object
  }
);

export const fetchUsers = createAsyncThunk(
  'auth/fetchUsers',
  async (_, { rejectWithValue }) => {
    const result = await dataService.getUsers();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

// ── Initial state ─────────────────────────────────────────────────────────
const initialState = {
  user:            null,
  role:            'guest',
  isAuthenticated: false,
  users:           [],
  status:          'idle',  // 'idle' | 'loading' | 'succeeded' | 'failed'
  error:           null,
};

// ── Slice ─────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    // ── bootstrapAuth ─────────────────────────────────────────────────────
    builder
      .addCase(bootstrapAuth.fulfilled, (state, { payload }) => {
        if (payload) {
          state.user            = payload.user;
          state.role            = payload.role;
          state.isAuthenticated = true;
        }
      });

    // ── loginUser ─────────────────────────────────────────────────────────
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error  = null;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.status          = 'succeeded';
        state.user            = payload.user;
        state.role            = payload.role;
        state.isAuthenticated = true;
        state.error           = null;
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error  = payload || 'Login failed.';
      });

    // ── logoutUser ────────────────────────────────────────────────────────
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user            = null;
        state.role            = 'guest';
        state.isAuthenticated = false;
        state.error           = null;
        state.status          = 'idle';
      });

    // ── registerUser ──────────────────────────────────────────────────────
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error  = null;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.status          = 'succeeded';
        state.user            = payload.user;
        state.role            = payload.role;
        state.isAuthenticated = true;
        state.error           = null;
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error  = payload || 'Registration failed.';
      });

    // ── updateUserProfile ─────────────────────────────────────────────────
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUserProfile.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.user   = payload;
      })
      .addCase(updateUserProfile.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error  = payload || 'Profile update failed.';
      });

    // ── fetchUsers ────────────────────────────────────────────────────────
    builder
      .addCase(fetchUsers.fulfilled, (state, { payload }) => {
        state.users = payload;
      });
  },
});

export const { clearError } = authSlice.actions;

// ── Backwards-compatible action aliases ──────────────────────────────────
// These allow existing components that import { login, logout, register }
// to still work without changes. They simply alias to the thunks.
export const login         = loginUser;
export const logout        = logoutUser;
export const register      = registerUser;
export const updateProfile = updateUserProfile;

export default authSlice.reducer;
