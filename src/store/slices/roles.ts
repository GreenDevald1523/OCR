import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface Roles {
  showCreateRoles: boolean;
  showEditRoles: boolean;
  currentRole: string;
  currentRoleId: number;
  currentRoleColor: string;
  isColorChanged: boolean;
}

const initialState: Roles = {
  showCreateRoles: false,
  showEditRoles: false,
  currentRole: '',
  currentRoleId: 0,
  currentRoleColor: '',
  isColorChanged: false,
};

export const rolesSlice = createSlice({
  name: 'rolesSlice',
  initialState,
  reducers: {
    setShowCreateRoles(state, action: PayloadAction<boolean>) {
      state.showCreateRoles = action.payload;
    },
    setShowEditRoles(state, action: PayloadAction<boolean>) {
      state.showEditRoles = action.payload;
    },
    setCurrentRole(state, action: PayloadAction<string>) {
      state.currentRole = action.payload;
    },
    setCurrentRoleId(state, action: PayloadAction<number>) {
      state.currentRoleId = action.payload;
    },
    setCurrentRoleColor(state, action: PayloadAction<string>) {
      state.currentRoleColor = action.payload;
    },
    setIsColorChanged(state, action: PayloadAction<boolean>) {
      state.isColorChanged = action.payload;
    },
  },
});

export const {
  setShowCreateRoles,
  setShowEditRoles,
  setCurrentRole,
  setCurrentRoleId,
  setCurrentRoleColor,
  setIsColorChanged,
} = rolesSlice.actions;

export const selectShowCreateRoles = (state: RootState) =>
  state.rolesSlice.showCreateRoles;
export const selectShowEditRoles = (state: RootState) =>
  state.rolesSlice.showEditRoles;
export const selectCurrentRole = (state: RootState) =>
  state.rolesSlice.currentRole;
export const selectCurrentRoleId = (state: RootState) =>
  state.rolesSlice.currentRoleId;
export const selectCurrentRoleColor = (state: RootState) =>
  state.rolesSlice.currentRoleColor;
export const selectIsColorChanged = (state: RootState) =>
  state.rolesSlice.isColorChanged;

export default rolesSlice.reducer;
