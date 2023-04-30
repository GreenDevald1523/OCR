import { Box, ScrollArea } from '@mantine/core';
import { FC } from 'react';
import { useTypedSelector } from 'store/ReduxHooks';
import {
  selectShowCreateRoles,
  selectShowEditRoles,
} from 'store/slices/roles';
import { AddNewRole } from './AddNewRole';
import { EditRoles } from './EditRoles';
import { EmptyOptions } from './EmptyOptions';

export const RoleOptions: FC = () => {
  const showCreateRoles = useTypedSelector(selectShowCreateRoles);
  const showEditRoles = useTypedSelector(selectShowEditRoles);
  return (
    <Box ml="20px" sx={{ width: '50%' }}>
      {!showCreateRoles && !showEditRoles && <EmptyOptions />}
      {showCreateRoles && <AddNewRole />}
      {showEditRoles && <EditRoles />}
    </Box>
  );
};
