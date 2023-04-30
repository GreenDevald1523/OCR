import React from 'react';
import { UnallowedUser } from 'pages/AcсessRights/ApproveUsers/UnallowedUser';
import type { User } from 'store/api/user';
import { Flex } from '@mantine/core';

export const UnallowedUsersList = ({
  unallowedUsers,
}: {
  unallowedUsers: (User & { id: number })[] | null;
}) => {
  return (
    <Flex gap={28} direction="column" mt={25}>
      {unallowedUsers &&
        unallowedUsers.map((user) => (
          <UnallowedUser key={user.displayname} user={user} />
        ))}
    </Flex>
  );
};
