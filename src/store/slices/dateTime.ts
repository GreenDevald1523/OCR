import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface DateTime {
  DateTimeValues: Record<string, Date>;
}

const initialState: DateTime = {
  DateTimeValues: {},
};

export const dateTime = createSlice({
  name: 'DateTimeValues',
  initialState,
  reducers: {
    setDateTime(state, action: PayloadAction<Record<string, Date>>) {
      state.DateTimeValues = { ...state.DateTimeValues, ...action.payload };
    },
    clearAll(state) {
      state.DateTimeValues = {};
    },
  },
});

export const { setDateTime, clearAll } = dateTime.actions;
export const selectDateTimeValues = (state: RootState) =>
  state.dateTime.DateTimeValues;

export default dateTime.reducer;
