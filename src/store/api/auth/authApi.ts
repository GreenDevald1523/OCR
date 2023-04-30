import { baseApi } from '../baseAPI';
import {
  RefreshInfo,
  UserLoginRequest,
  UserRegistrationRequest,
  UserSession,
} from './types';

export const AuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<void, UserRegistrationRequest>({
      query: (userValues) => ({
        url: '/auth/signup',
        method: 'POST',
        body: { ...userValues },
      }),
    }),
    login: builder.mutation<RefreshInfo, UserLoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: { ...credentials },
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'DELETE',
        body: {},
      }),
    }),
    refresh: builder.mutation<RefreshInfo, RefreshInfo>({
      query: ({ refresh_token }) => ({
        url: 'refresh',
        mathod: 'POST',
        body: { refresh_token },
      }),
    }),
    getSessions: builder.query<UserSession[], void>({
      query: () => ({
        url: 'session',
      }),
    }),
    deleteSession: builder.mutation<void, { session_id: number }>({
      query: ({ session_id }) => ({
        url: 'session',
        method: 'DELETE',
        body: { session_id },
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
  useDeleteSessionMutation,
  useGetSessionsQuery,
} = AuthApi;
