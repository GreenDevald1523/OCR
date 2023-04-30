import React, { useMemo } from 'react';
import { Box, Text } from '@mantine/core';

import { useUsers } from 'hooks/useUsers';

import { UnallowedUsersList } from 'pages/AcсessRights/ApproveUsers/UnallowedUsersList';

export const ApproveUsers = () => {
  const { allUsers } = useUsers();

  const unallowedUsers = useMemo(
    () => (allUsers ? allUsers.filter((user) => !user.allowed) : null),
    [allUsers]
  );

  return (
    <Box w="100%">
      <Text fw={700} fz={18}>
        СПИСОК ПОЛЬЗОВАТЕЛЕЙ
      </Text>
      <UnallowedUsersList unallowedUsers={unallowedUsers} />
    </Box>
  );
};

export default ApproveUsers;
