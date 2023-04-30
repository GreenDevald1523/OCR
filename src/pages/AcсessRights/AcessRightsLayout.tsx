import { Flex } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { AccessRightsTabs } from '../../components/AcсessRightsTabs/AcсessRightsTabs';

export const AccessRightsLayout = () => {
  return (
    <Flex
      direction="column"
      align="flex-start"
      p={25}
      gap={10}
      w="100%"
      mah="100%"
    >
      <AccessRightsTabs />
      <Outlet />
    </Flex>
  );
};
