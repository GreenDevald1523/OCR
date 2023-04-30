import { useMemo } from 'react';
import { User } from 'store/api/user';
import {
  useGetAllUsersQuery,
  useGetClientUserQuery,
  useGetRolesByUserIdQuery,
} from 'store/api/user/userApi';

export const useUsers = () => {
  const allUsers = useGetAllUsersQuery().data;
  const ClientUser = useGetClientUserQuery().data;
  const currentUserRoles =
    useGetRolesByUserIdQuery((ClientUser || ({} as User)).id || 0).data || [];

  const arrayOfUsersNames = useMemo(() => {
    return (allUsers || []).map((user) => user.displayname);
  }, [allUsers]);

  return {
    currentUser: ClientUser,
    currentUserRoles: currentUserRoles,
    allUsers: allUsers,
    allUsersNames: arrayOfUsersNames,
  };
};
