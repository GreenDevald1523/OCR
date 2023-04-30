import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { NewSchemeField, SupportedFieldTypes } from './types';

interface NewSchemeState {
  name: string;
  fields: NewSchemeField<SupportedFieldTypes>[];
}

const initialState: NewSchemeState = {
  name: '',
  fields: [],
};

export const newSchemeSlice = createSlice({
  name: 'newScheme',
  initialState,
  reducers: {
    setNewSchemeName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    addFieldToNewScheme(
      state,
      action: PayloadAction<NewSchemeField<SupportedFieldTypes>>
    ) {
      state.fields.push(action.payload);
    },
    removeFieldFromNewScheme(state, action: PayloadAction<number | void>) {
      if (action.payload) {
        state.fields.splice(action.payload, 1);
        return;
      }
      state.fields.pop();
    },
    clearNewScheme(state) {
      state.fields = [];
      state.name = '';
    },
  },
});

export const {
  setNewSchemeName,
  addFieldToNewScheme,
  removeFieldFromNewScheme,
  clearNewScheme,
} = newSchemeSlice.actions;

export const selectNewSchemeName = (state: RootState) => state.newScheme.name;
export const selectNewSchemeFields = (state: RootState) =>
  state.newScheme.fields;
