import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface Ocr {
  isScanVisible: boolean;
}

const initialState: Ocr = {
  isScanVisible: true,
};

export const ocrSlice = createSlice({
  name: 'ocrSlice',
  initialState,
  reducers: {
    toggleIsScanVisible(state) {
      state.isScanVisible = !state.isScanVisible;
    },
  },
});

export const { toggleIsScanVisible } = ocrSlice.actions;

export const selectIsScanVisible = (state: RootState) =>
  state.ocrSlice.isScanVisible;
export default ocrSlice.reducer;
