import {
  Role,
  useGetAllRolesQuery,
  useGetAllUsersByRoleIdQuery,
  useGetRoleQuery,
} from 'store/api/role';
import { useTypedSelector } from 'store/ReduxHooks';
import { selectCurrentRoleId } from 'store/slices/roles';

export const useRoles = () => {
  const allRoles = useGetAllRolesQuery();
  const currentRoleId = useTypedSelector(selectCurrentRoleId);
  const currentRole = useGetRoleQuery(currentRoleId).data || ({} as Role);
  const usersByCurrentRoleId = useGetAllUsersByRoleIdQuery(currentRoleId);
  const usersIdsByCurrentRoleId = (usersByCurrentRoleId.data || []).map(
    (user) => user.id
  );

  return {
    allRoles: allRoles.data || [],
    allRolesIsSuccess: allRoles.isLoading,
    currentRole,
    usersIdsByCurrentRoleId: usersIdsByCurrentRoleId,
    usersByCurrentRoleId: usersByCurrentRoleId.data || [],
    usersByCurrentRoleIdIsSuccess: usersByCurrentRoleId.isLoading,
  };
};
