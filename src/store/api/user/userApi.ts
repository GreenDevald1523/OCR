import { baseApi } from '../baseAPI';
import { Role } from '../role';
import { ClientUser, User } from './types';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClientUser: builder.query<ClientUser, void>({
      query: () => ({
        url: '/user/me',
      }),
      providesTags: ['UserData'],
    }),
    getRolesByUserId: builder.query<Role[], number>({
      async queryFn(_arg, _queryApi, _qxtraOptions, fetchWithBq) {
        const groupsIdsByUserId = await fetchWithBq({
          url: `/user/${_arg}/groups`,
        });

        const groupsArray = await Promise.all(
          (groupsIdsByUserId.data as number[]).map(async (groupId) => {
            const group = await fetchWithBq({
              url: `/group/${groupId}`,
            });
            return group.data as Role;
          })
        );

        return { data: groupsArray as Role[] };
      },
      providesTags: ['CurrentUserRoles'],
    }),
    getAllUsers: builder.query<(User & { id: number })[], void>({
      async queryFn(_arg, _queryApi, _qxtraOptions, fetchWithBq) {
        const allUsersIds = await fetchWithBq({
          url: '/user/all',
        });

        const usersArray = await Promise.all(
          (allUsersIds.data as number[]).map(async (userId) => {
            const user = await fetchWithBq({
              url: `/user/${userId}`,
            });
            const res = user.data as User & { id: number };
            res.id = userId;
            return res;
          })
        );

        return { data: usersArray as (User & { id: number })[] };
      },
      providesTags: ['AllUsers'],
    }),
    updateUserData: builder.mutation<void, Omit<User, 'allowed'>>({
      query: (body) => ({
        url: '/user/me',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['UserData'],
    }),
    updateUserPassword: builder.mutation<
      void,
      { new_password: string; old_password: string }
    >({
      query: (body) => ({
        url: '/user/me/password',
        method: 'PUT',
        body,
      }),
    }),
    allowUser: builder.mutation<void, { allowed: boolean; id: number }>({
      query: ({ allowed, id }) => ({
        url: `user/${id}/allowed`,
        method: 'PUT',
        body: { allowed },
      }),
      invalidatesTags: ['AllUsers'],
    }),
    deleteUser: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `user/${id}`,
        method: 'DELETE',
        body: {},
      }),
      invalidatesTags: ['AllUsers'],
    }),
  }),
});

export const {
  useUpdateUserDataMutation,
  useGetClientUserQuery,
  useGetRolesByUserIdQuery,
  useUpdateUserPasswordMutation,
  useGetAllUsersQuery,
  useAllowUserMutation,
  useDeleteUserMutation,
} = userApi;
