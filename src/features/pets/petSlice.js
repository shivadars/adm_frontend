import { createSlice } from '@reduxjs/toolkit';

const DEFAULT_FIELDS = [
  { id: 'name',      label: 'Pet Name',      type: 'text',   required: true,  placeholder: 'Enter pet name...' },
  { id: 'dob',       label: 'Date of Birth', type: 'date',   required: true,  placeholder: '' },
  { id: 'breed',     label: 'Breed Name',    type: 'text',   required: true,  placeholder: 'e.g. Golden Retriever' },
  { id: 'photo',     label: 'Pet Photo',     type: 'image',  required: false, placeholder: '' },
  { id: 'instagram', label: 'Pet Instagram', type: 'text',   required: false, placeholder: '@handle' }
];

const loadFromStorage = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (e) {
    return fallback;
  }
};

const initialState = {
  // All pets across all users for this demo (persisted in localStorage)
  userPets: loadFromStorage('adoremom_pets', {}), 
  // Dynamic fields configured by admin
  fields: loadFromStorage('adoremom_pet_fields', DEFAULT_FIELDS)
};

const petSlice = createSlice({
  name: 'pets',
  initialState,
  reducers: {
    addPet: (state, action) => {
      const { userId, pet } = action.payload;
      if (!userId) return;
      if (!state.userPets[userId]) state.userPets[userId] = [];
      
      const newPet = {
        ...pet,
        id: `pet_${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      
      state.userPets[userId].push(newPet);
      localStorage.setItem('adoremom_pets', JSON.stringify(state.userPets));
    },
    updatePet: (state, action) => {
      const { userId, petId, updates } = action.payload;
      if (!userId || !state.userPets[userId]) return;
      
      state.userPets[userId] = state.userPets[userId].map(p => 
        p.id === petId ? { ...p, ...updates } : p
      );
      localStorage.setItem('adoremom_pets', JSON.stringify(state.userPets));
    },
    deletePet: (state, action) => {
      const { userId, petId } = action.payload;
      if (!userId || !state.userPets[userId]) return;
      
      state.userPets[userId] = state.userPets[userId].filter(p => p.id !== petId);
      localStorage.setItem('adoremom_pets', JSON.stringify(state.userPets));
    },
    updateFields: (state, action) => {
      state.fields = action.payload;
      localStorage.setItem('adoremom_pet_fields', JSON.stringify(state.fields));
    }
  }
});

export const { addPet, updatePet, deletePet, updateFields } = petSlice.actions;

// Selectors
export const selectUserPets = (state, userId) => state.pets.userPets[userId] || [];
export const selectPetFields = (state) => state.pets.fields || DEFAULT_FIELDS;

export default petSlice.reducer;
