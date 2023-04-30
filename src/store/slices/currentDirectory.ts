import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { NodeModelType } from '../api/directory/types';

interface CurrentDirectoryState {
  currentDirectoryId: number | null;
  directoryIds: number[];
  directoriesList: NodeModelType[];
  selectedDocumentId: number | null;
}

const initialState: CurrentDirectoryState = {
  currentDirectoryId: Number(localStorage.getItem('currentDirectoryId'))
    ? Number(localStorage.getItem('currentDirectoryId'))
    : null,
  directoryIds: [],
  directoriesList: [],
  selectedDocumentId: null,
};

export const currentDirectorySlice = createSlice({
  name: 'currentDirectory',
  initialState,
  reducers: {
    setCurrentDirectoryId(state, action: PayloadAction<number | null>) {
      state.currentDirectoryId = action.payload;
    },
    addDirectoryIds(state, action: PayloadAction<number[]>) {
      const tempSet = new Set(state.directoryIds.concat(action.payload));
      state.directoryIds = Array.from(tempSet);
    },
    clearDirectoryIds(state) {
      state.directoryIds = [];
    },
    setDirectoriesList(state, action: PayloadAction<NodeModelType[]>) {
      state.directoriesList = action.payload;
    },
    setSelectedDocumentId(state, action: PayloadAction<number | null>) {
      state.selectedDocumentId = action.payload;
    },
  },
});

export const {
  setCurrentDirectoryId,
  addDirectoryIds,
  clearDirectoryIds,
  setDirectoriesList,
  setSelectedDocumentId,
} = currentDirectorySlice.actions;

export const selectCurrentDirectoryId = (state: RootState) =>
  state.currentDirectory.currentDirectoryId;
export const selectDirectoryIds = (state: RootState) =>
  state.currentDirectory.directoryIds;
export const selectDirectoriesList = (state: RootState) =>
  state.currentDirectory.directoriesList;
export const selectSelectedDocumentId = (state: RootState) =>
  state.currentDirectory.selectedDocumentId;

export default currentDirectorySlice.reducer;
