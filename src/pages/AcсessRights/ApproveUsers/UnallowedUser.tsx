import { Flex, Text } from '@mantine/core';
import { UserProfileAvatar } from 'components/UserProfileAvatar/UserProfileAvatar';

import { ApproveButtons } from 'pages/AcсessRights/ApproveUsers/ApproveButtons';
import { useCallback } from 'react';
import {
  useAllowUserMutation,
  useDeleteUserMutation,
} from 'store/api/user/userApi';

import type { User } from 'store/api/user';

export const UnallowedUser = ({ user }: { user: User & { id: number } }) => {
  const [approveUser] = useAllowUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const approveHandler = useCallback(
    () => approveUser({ allowed: true, id: user.id }),
    [user, approveUser]
  );
  const rejectHandler = useCallback(
    () => deleteUser({ id: user.id }),
    [user, deleteUser]
  );

  return (
    <Flex align="center" gap={10} w="100%">
      <UserProfileAvatar displayname={user.displayname} />
      <Text fz={18} fw={500} sx={{ width: 290 }}>
        {user.displayname}
      </Text>
      <Text w="auto" fz={17}>
        {user.email}
      </Text>
      <ApproveButtons onApprove={approveHandler} onReject={rejectHandler} />
    </Flex>
  );
};
