import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface UserState {
  login: string;
  email: string;
  displayName: string;
  additionalInfo: string;
}

const initialState: UserState = {
  login: '',
  email: '',
  displayName: '',
  additionalInfo: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLogin(state, action: PayloadAction<string>) {
      state.login = action.payload;
    },
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setDispayName(state, action: PayloadAction<string>) {
      state.displayName = action.payload;
    },
    setAdditionalInfo(state, action: PayloadAction<string>) {
      state.additionalInfo = action.payload;
    },
  },
});

export const { setLogin, setEmail, setDispayName, setAdditionalInfo } =
  userSlice.actions;

export const selectLogin = (state: RootState) => state.userSlice.login;
export const selectEmail = (state: RootState) => state.userSlice.email;
export const selectDisplayName = (state: RootState) =>
  state.userSlice.displayName;
export const selectAdditionalInfo = (state: RootState) =>
  state.userSlice.additionalInfo;

export default userSlice.reducer;
