import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseAPI';
import authReducer from './slices/authSlice';
import menuReducer from './slices/menu';
import newSchemeReducer from './slices/newSchemeSlice';
import currentDirectory from './slices/currentDirectory';
import ocrSlice from './slices/ocrSlice';
import currentType from './slices/currentType';
import rolesSlice from './slices/roles';
import userSlice from './slices/user';
import dateTime from './slices/dateTime';

import { rtkQueryErrorLogger } from './middleware/ErrorCatching';
import { TokenCacheMiddleware } from './middleware/TokenCaching';

const appReducer = combineReducers({
  auth: authReducer,
  currentTypeAndFieldsData: currentType,
  newScheme: newSchemeReducer,
  menu: menuReducer,
  ocrSlice: ocrSlice,
  rolesSlice: rolesSlice,
  userSlice: userSlice,
  dateTime: dateTime,
  currentDirectory,
  [baseApi.reducerPath]: baseApi.reducer,
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const rootReducer = (state, action) => {
  if (action.type === 'auth/logoutRefreshInStore')
    return appReducer(undefined, action);
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      baseApi.middleware,
      rtkQueryErrorLogger,
      TokenCacheMiddleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
