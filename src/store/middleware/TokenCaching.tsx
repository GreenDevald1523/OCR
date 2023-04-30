import type { MiddlewareAPI, Middleware } from '@reduxjs/toolkit';
import { AuthApi } from '../api/auth';
import { setCredentials } from '../slices/authSlice';

const { login, refresh, logout } = AuthApi.endpoints;

const isAuthActionFulfilled = (action: any) =>
  login.matchFulfilled(action) || refresh.matchFulfilled(action);

/**
 * Если у нас какая то ошибка нетворка - выводим уведомление об этом
 */
export const TokenCacheMiddleware: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (isAuthActionFulfilled(action)) {
      localStorage.setItem('refresh_token', action.payload.refresh_token);
      api.dispatch(setCredentials(action.payload.refresh_token));
    }

    if (logout.matchFulfilled(action)) {
      localStorage.removeItem('refresh_token');
    }

    return next(action);
  };
