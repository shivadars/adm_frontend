import { createSlice } from '@reduxjs/toolkit';

const editModeSlice = createSlice({
  name: 'editMode',
  initialState: { active: false },
  reducers: {
    toggleEditMode: (state) => { state.active = !state.active; },
    setEditMode:    (state, { payload }) => { state.active = payload; },
  },
});

export const { toggleEditMode, setEditMode } = editModeSlice.actions;
export default editModeSlice.reducer;
