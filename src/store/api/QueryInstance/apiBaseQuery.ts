import { FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logoutRefreshInStore } from '../../slices/authSlice';
import { RootState } from '../../store';
import { Mutex } from 'async-mutex';
import { BaseQueryFn, FetchBaseQueryError } from '@reduxjs/toolkit/query';

const mutex = new Mutex();
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: 'include',
});

interface IRefreshResponse {
  refresh_token: string;
}

// Когда типизация занимает больше часа - это верный признак того что у тебя проблемы с башкой и пора юзать ts-ignore
// (Но через какое то время всё равно придётся типизировать)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const baseQueryWithRefresh: BaseQueryFn<
  FetchArgs,
  unknown,
  FetchBaseQueryError,
  Record<string, unknown>,
  Record<string, unknown>
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (
    result?.error &&
    result?.error?.status === 403 &&
    args.url !== '/user/me'
  ) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshResult = await baseQuery(
          {
            url: '/auth/refresh',
            method: 'POST',
            body: {
              refresh_token: (api.getState() as RootState).auth.refreshToken,
            },
          },
          api,
          extraOptions
        );

        if (refreshResult?.data) {
          api.dispatch(
            setCredentials({
              refresh_token: (refreshResult.data as IRefreshResponse)
                .refresh_token,
            })
          );
          localStorage.setItem(
            'refresh_token',
            (refreshResult.data as IRefreshResponse).refresh_token
          );

          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logoutRefreshInStore());
          localStorage.removeItem('refresh_token');
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};
