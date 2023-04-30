/* eslint-disable @typescript-eslint/ban-ts-comment */

import { baseApi } from '../baseAPI';
import {
  DirectoryWithInnerInfo,
  Directory,
  CreateDirectoryRequestBody,
} from './types';

export const directoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllDirectories: builder.query<Directory[], void>({
      async queryFn(arg, api, extraOptions, baseQuery) {
        const result: Directory[] = [];
        const idsToFetch: Array<number[]> = [];

        const { data } = await baseQuery({
          url: '/directory/root',
        });

        const directoriesFetchingCallback = async (batch: number[]) => {
          const batchResult = await Promise.all(
            batch.map((id) => baseQuery({ url: `/directory/${id}` }))
          );
          batchResult.forEach((elem) => {
            const directoryInfo = elem.data
              ? (elem.data as DirectoryWithInnerInfo)
              : null;

            if (directoryInfo) {
              result.push(directoryInfo.directory as Directory);
              idsToFetch.push(directoryInfo.inner_directories_id);
            }
          });
        };

        idsToFetch.push(data as number[]);

        for (const batch of idsToFetch) {
          await directoriesFetchingCallback(batch);
        }

        return { data: result };
      },
      providesTags: ['AllDirectories'],
    }),
    createDirectory: builder.mutation<Directory, CreateDirectoryRequestBody>({
      query: (body) => ({
        url: '/directory',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AllDirectories'],
    }),
  }),
});

export const { useGetAllDirectoriesQuery, useCreateDirectoryMutation } =
  directoryApi;
