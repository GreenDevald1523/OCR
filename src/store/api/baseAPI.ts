import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { baseQueryWithRefresh } from './QueryInstance/apiBaseQuery';

export const baseApi = createApi({
  baseQuery: baseQueryWithRefresh,
  tagTypes: [
    'AllDocuments',
    'AllSchemes',
    'AllDirectories',
    'AllRoles',
    'AllUsers',
    'RelatedRoles',
    'DirectoryRules',
    'CurrentRoleUsers',
    'CurrentRole',
    'CurrentUserRoles',
    'UserData',
  ],
  endpoints: () => ({}),
});
