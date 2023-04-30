import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface CurrentType {
  chosenTypeName: string;
  chosenTypeId: number;
}

const initialState: CurrentType = {
  chosenTypeName: '',
  chosenTypeId: -1,
};

export const currentType = createSlice({
  name: 'CurrentType',
  initialState,
  reducers: {
    setCurrentTypeName(state, action: PayloadAction<string>) {
      state.chosenTypeName = action.payload;
    },
    setCurrentTypeId(state, action: PayloadAction<number>) {
      state.chosenTypeId = action.payload;
    },
  },
});

export const { setCurrentTypeId, setCurrentTypeName } = currentType.actions;

export const selectCurrentTypeName = (state: RootState) =>
  state.currentTypeAndFieldsData.chosenTypeName;
export const selectCurrentTypeId = (state: RootState) =>
  state.currentTypeAndFieldsData.chosenTypeId;

export default currentType.reducer;
