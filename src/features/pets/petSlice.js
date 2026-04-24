/**
 * petSlice.js
 *
 * Manages pet profiles per user.
 * All persistence goes through dataService — no direct localStorage access.
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dataService from '../../services/dataService';

// ── Default fields ────────────────────────────────────────────────────────
const DEFAULT_FIELDS = [
  { id: 'name',      label: 'Pet Name',      type: 'text',  required: true,  placeholder: 'Enter pet name...' },
  { id: 'dob',       label: 'Date of Birth', type: 'date',  required: true,  placeholder: '' },
  { id: 'breed',     label: 'Breed Name',    type: 'text',  required: true,  placeholder: 'e.g. Golden Retriever' },
  { id: 'photo',     label: 'Pet Photo',     type: 'image', required: false, placeholder: '' },
  { id: 'instagram', label: 'Pet Instagram', type: 'text',  required: false, placeholder: '@handle' },
];

// ── Thunks ────────────────────────────────────────────────────────────────
export const fetchPets = createAsyncThunk(
  'pets/fetchAll',
  async (_, { rejectWithValue }) => {
    const result = await dataService.getAllPets();
    if (!result.success) return rejectWithValue(result.error);
    return result.data; // { [userId]: [pets] }
  }
);

export const fetchUserPets = createAsyncThunk(
  'pets/fetchUser',
  async (userId, { rejectWithValue }) => {
    const result = await dataService.getPets(userId);
    if (!result.success) return rejectWithValue(result.error);
    return { userId, pets: result.data };
  }
);

export const addPetAsync = createAsyncThunk(
  'pets/add',
  async ({ userId, pet }, { rejectWithValue }) => {
    const result = await dataService.addPet(userId, pet);
    if (!result.success) return rejectWithValue(result.error);
    return { userId, pet: result.data };
  }
);

export const updatePetAsync = createAsyncThunk(
  'pets/update',
  async ({ userId, petId, updates }, { rejectWithValue }) => {
    const result = await dataService.updatePet(userId, petId, updates);
    if (!result.success) return rejectWithValue(result.error);
    return { userId, petId, pet: result.data };
  }
);

export const deletePetAsync = createAsyncThunk(
  'pets/delete',
  async ({ userId, petId }, { rejectWithValue }) => {
    const result = await dataService.deletePet(userId, petId);
    if (!result.success) return rejectWithValue(result.error);
    return { userId, petId };
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────
const petSlice = createSlice({
  name: 'pets',
  initialState: {
    userPets: {},
    fields:   DEFAULT_FIELDS,
    status:   'idle',
    error:    null,
  },
  reducers: {
    // Fields are admin-configured and can stay synchronous
    updateFields: (state, action) => {
      state.fields = action.payload;
      // Note: field persistence is handled by listener middleware
    },
  },
  extraReducers: (builder) => {
    // fetchPets (all users)
    builder
      .addCase(fetchPets.fulfilled, (state, { payload }) => {
        state.userPets = payload || {};
        state.status   = 'succeeded';
      })
      .addCase(fetchPets.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error  = payload || 'Failed to load pets.';
      });

    // fetchUserPets (single user)
    builder
      .addCase(fetchUserPets.fulfilled, (state, { payload }) => {
        state.userPets[payload.userId] = payload.pets;
      });

    // addPetAsync
    builder
      .addCase(addPetAsync.fulfilled, (state, { payload }) => {
        const { userId, pet } = payload;
        if (!state.userPets[userId]) state.userPets[userId] = [];
        state.userPets[userId].push(pet);
      })
      .addCase(addPetAsync.rejected, (state, { payload }) => {
        state.error = payload || 'Failed to add pet.';
      });

    // updatePetAsync
    builder
      .addCase(updatePetAsync.fulfilled, (state, { payload }) => {
        const { userId, petId, pet } = payload;
        if (state.userPets[userId]) {
          state.userPets[userId] = state.userPets[userId].map((p) =>
            p.id === petId ? pet : p
          );
        }
      });

    // deletePetAsync
    builder
      .addCase(deletePetAsync.fulfilled, (state, { payload }) => {
        const { userId, petId } = payload;
        if (state.userPets[userId]) {
          state.userPets[userId] = state.userPets[userId].filter((p) => p.id !== petId);
        }
      });
  },
});

export const { updateFields } = petSlice.actions;

// ── Backwards-compatible action aliases ───────────────────────────────────
// Components that dispatch addPet / updatePet / deletePet will still work
export const addPet    = addPetAsync;
export const updatePet = updatePetAsync;
export const deletePet = deletePetAsync;

// ── Selectors ─────────────────────────────────────────────────────────────
export const selectUserPets  = (state, userId) => state.pets.userPets[userId] || [];
export const selectPetFields = (state)         => state.pets.fields || DEFAULT_FIELDS;

export default petSlice.reducer;
