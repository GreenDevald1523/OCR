import { useCallback } from 'react';
import {
  RoleDirectoryRights,
  useGetRoleRightsByDirectoryIdQuery,
  usePostRoleRightsByDirectoryIdMutation,
} from 'store/api/role';

export const useRoleDirectoryRights = (directoryId: number, roleId: number) => {
  const rights = useGetRoleRightsByDirectoryIdQuery({ directoryId, roleId });

  const [updateRoleRights] = usePostRoleRightsByDirectoryIdMutation();

  const onChangeRoleRight = useCallback(
    (args: Omit<RoleDirectoryRights, 'directory_id'>) => {
      updateRoleRights({ directoryId, group_id: roleId, ...args });
    },
    [directoryId, roleId, updateRoleRights]
  );

  return {
    rights: rights.isLoading ? null : rights.currentData,
    onChangeRoleRight,
  };
};
