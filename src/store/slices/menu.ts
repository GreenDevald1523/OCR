import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface OpenedMenu {
  isOpenedMenu: boolean;
}

const initialState: OpenedMenu = {
  isOpenedMenu: false,
};

export const menu = createSlice({
  name: 'isOpenedMenu',
  initialState,
  reducers: {
    toggleIsOpenedMenu(state) {
      state.isOpenedMenu = !state.isOpenedMenu;
    },
    setIsOpenedMenu(state, action: PayloadAction<boolean>) {
      state.isOpenedMenu = action.payload;
    },
  },
});

export const { toggleIsOpenedMenu, setIsOpenedMenu } = menu.actions;

export const selectIsOpened = (state: RootState) => state.menu.isOpenedMenu;

export default menu.reducer;
