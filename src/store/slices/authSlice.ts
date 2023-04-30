import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface AuthState {
  refreshToken: string;
  isAllowed: boolean | undefined;
}

const initialState: AuthState = {
  refreshToken: localStorage.getItem('refresh_token') || '',
  isAllowed: undefined,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ refresh_token: string }>) {
      state.refreshToken = action.payload.refresh_token;
    },
    logoutRefreshInStore(state) {
      state.refreshToken = '';
    },
    setIsAllowed(state, action: PayloadAction<boolean>) {
      state.isAllowed = action.payload;
    },
  },
});

export const { setCredentials, logoutRefreshInStore, setIsAllowed } =
  authSlice.actions;

export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;
export const selectIsAllowed = (state: RootState) => state.auth.isAllowed;

export default authSlice.reducer;
