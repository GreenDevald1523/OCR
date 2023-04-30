/* eslint-disable @typescript-eslint/naming-convention */
import { baseApi } from '../baseAPI';
import {
  Role,
  RoleDirectoryRights,
  RoleDirectoryRightsRequestBody,
  UserByRoleId,
} from './types';

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRole: builder.query<Role, number>({
      async queryFn(_arg, _queryApi, _qxtraOptions, fetchWithBq) {
        const roleById = await fetchWithBq({
          url: `/group/${_arg}`,
        });

        return { data: roleById.data as Role };
      },
      providesTags: ['CurrentRole'],
    }),
    getAllRoles: builder.query<Role[], void>({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        // const allRolesIds = await _baseQuery({ url: '/group/all' })
        const allRolesQuery = await _baseQuery({
          url: '/group/all',
        });

        const allRolesIds = allRolesQuery.data as number[];

        const result = await Promise.all(
          allRolesIds.map((id) => _baseQuery({ url: `/group/${id}` }))
        );

        return { data: result.map((query) => query.data) as Role[] };
      },
      providesTags: ['AllRoles'],
    }),
    getAllRolesRelatedToDirectory: builder.query<
      Role[],
      { directoryId: number }
    >({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        const allRolesQuery = await _baseQuery({
          url: '/group/all',
        });

        const allRolesIds = allRolesQuery.data as number[];

        const relatedRights = await Promise.all(
          allRolesIds.map((id) =>
            _baseQuery({
              url: `/directory/${_arg.directoryId}/group_rules/${id}`,
            })
          )
        );

        const relatedRoles = await Promise.all(
          relatedRights.map((right, index) => {
            if (!right.error)
              return _baseQuery({
                url: `/group/${allRolesIds[index]}`,
              });
          })
        );

        return {
          data: relatedRoles
            .filter((elem) => !!elem)
            .map((elem) => elem && elem.data) as Role[],
        };
      },
      providesTags: ['RelatedRoles'],
    }),
    getAllUsersByRoleId: builder.query<
      (UserByRoleId & { id: number })[],
      number
    >({
      async queryFn(_arg, _queryApi, _qxtraOptions, fetchWithBq) {
        const allUsersIdByRoleId = await fetchWithBq({
          url: `/group/${_arg}/users`,
        });

        const usersArray = await Promise.all(
          (allUsersIdByRoleId.data as number[]).map(async (userId) => {
            const user = await fetchWithBq({
              url: `/user/${userId}`,
            });
            const res = user.data as UserByRoleId & { id: number };
            res.id = userId;
            return res;
          })
        );

        return { data: usersArray as (UserByRoleId & { id: number })[] };
      },
      providesTags: ['CurrentRoleUsers'],
    }),
    getRoleRightsByDirectoryId: builder.query<
      RoleDirectoryRights,
      { directoryId: number; roleId: number }
    >({
      query: ({ directoryId, roleId }) => ({
        url: `/directory/${directoryId}/group_rules/${roleId}`,
      }),
      providesTags: ['DirectoryRules'],
    }),
    postRoleRightsByDirectoryId: builder.mutation<
      void,
      RoleDirectoryRightsRequestBody & { directoryId: number }
    >({
      query: (body) => {
        const { directoryId, ...restBody } = body;

        return {
          url: `/directory/${directoryId}/access`,
          body: { ...restBody },
          method: 'POST',
        };
      },
      invalidatesTags: ['DirectoryRules'],
    }),
    deleteRoleRightsByDirectoryId: builder.mutation<
      void,
      { roleId: number; directoryId: number }
    >({
      query: ({ roleId, directoryId }) => ({
        url: `/directory/${directoryId}/access`,
        method: 'DELETE',
        body: { group_id: roleId },
      }),
      invalidatesTags: ['AllRoles', 'RelatedRoles'],
    }),
    deleteRole: builder.mutation<void, number>({
      query: (roleId) => ({
        url: `/group/${roleId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AllRoles', 'RelatedRoles'],
    }),
    addRole: builder.mutation<Role, Omit<Role, 'id'>>({
      query: (body) => ({
        url: `/group`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['AllRoles', 'RelatedRoles'],
    }),
    addUsersToRoleById: builder.mutation<
      void,
      { user_id: number; group_id: number }
    >({
      query: (body) => {
        const { group_id, ...restBody } = body;
        return {
          url: `/group/${group_id}/users`,
          method: 'POST',
          body: { ...restBody },
        };
      },
      invalidatesTags: ['AllRoles', 'RelatedRoles', 'CurrentRoleUsers'],
    }),
    editRole: builder.mutation<void, Omit<Role, 'id'> & { group_id: number }>({
      query: (body) => {
        const { group_id, ...restBody } = body;
        return {
          url: `/group/${group_id}`,
          method: 'PUT',
          body: { ...restBody },
        };
      },
      invalidatesTags: ['AllRoles', 'RelatedRoles', 'CurrentRole'],
    }),
    deleteUsersToRoleById: builder.mutation<
      void,
      { user_id: number; group_id: number }
    >({
      query: (body) => {
        const { group_id, ...restBody } = body;
        return {
          url: `/group/${group_id}/users`,
          method: 'DELETE',
          body: { ...restBody },
        };
      },
      invalidatesTags: ['CurrentRoleUsers'],
    }),
    giveRoleRightsByDirectoryId: builder.mutation<
      void,
      { directoryId: number; roleId: number }
    >({
      query: ({ directoryId, roleId }) => ({
        url: `/directory/${directoryId}/access`,
        method: 'POST',
        body: (() => {
          // Вся вот эта ебатория сделана для неебически жёскава тайп-сейфти, поменяем интерфейс - и узнаем
          // где приложухе стало больно, а если бы просто в body пихнул объект, то было бы грустно потом искать
          const nullishBody: Omit<
            RoleDirectoryRights & { group_id: number },
            'directory_id'
          > = {
            group_id: roleId,
            read: null,
            delete: null,
            document_create: null,
            document_delete: null,
            document_modify: null,
            document_move_to: null,
            document_move_from: null,
            directory_create: null,
            directory_modify: null,
            directory_move_to: null,
            directory_move_from: null,
          };

          return nullishBody;
        })(),
      }),
      invalidatesTags: ['RelatedRoles'],
    }),
  }),
});

export const {
  useEditRoleMutation,
  useDeleteUsersToRoleByIdMutation,
  useAddUsersToRoleByIdMutation,
  useAddRoleMutation,
  useGetRoleQuery,
  useGetAllRolesQuery,
  useDeleteRoleRightsByDirectoryIdMutation,
  useDeleteRoleMutation,
  useGetAllUsersByRoleIdQuery,
  useGetRoleRightsByDirectoryIdQuery,
  useGetAllRolesRelatedToDirectoryQuery,
  usePostRoleRightsByDirectoryIdMutation,
  useGiveRoleRightsByDirectoryIdMutation, // чисто для инициализации роли
} = roleApi;
