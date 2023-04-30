import { Input, Flex, Button, Divider, Box } from '@mantine/core';
import { IconSearch } from '@tabler/icons';
import { FC, useState } from 'react';
import { useTypedSelector, useTypedDispatch } from 'store/ReduxHooks';
import { selectIsOpened } from 'store/slices/menu';
import {
  setCurrentRoleColor,
  setIsColorChanged,
  setShowCreateRoles,
  setShowEditRoles,
} from 'store/slices/roles';
import { ListOfRoles } from './ListOfRoles/ListOfRoles';
import { RoleOptions } from './RoleOptions/RoleOptions';

export const CreateRoles: FC = () => {
  const dispatch = useTypedDispatch();
  const isOpenedMenu = useTypedSelector(selectIsOpened);
  const [foundRole, setFoundRole] = useState('');

  return (
    <Box sx={{ height: '100%' }}>
      <Flex mt="20px" gap="20px" align="center">
        <Input.Wrapper sx={{ width: '100%', maxWidth: '600px' }}>
          <Input
            styles={{
              input: {
                width: '100%',
                height: '52px',
                fontSize: '18px',
                borderRadius: '11px',
              },
              rightSection: {
                marginRight: '10px',
              },
            }}
            onChange={(e: any) => setFoundRole(e.target.value)}
            placeholder="Введите название роли"
            rightSection={<IconSearch size={22} color="#CED4DA" />}
          />
        </Input.Wrapper>
        <Button
          sx={{
            borderRadius: '8px',
            fontWeight: 500,
            fontSize: 19,
            height: '43px',
          }}
          onClick={() => {
            dispatch(setShowCreateRoles(true));
            dispatch(setShowEditRoles(false));
            dispatch(setIsColorChanged(false));
            dispatch(setCurrentRoleColor(''));
          }}
        >
          Создать роль
        </Button>
      </Flex>
      <Flex
        gap="27px"
        mt="30px"
        sx={{
          height: '100%',
          transition: 'all 0.3s',
          width: isOpenedMenu ? 'calc(100vw - 410px)' : 'calc(100vw - 80px)',
        }}
      >
        <ListOfRoles rolesToDislay={foundRole} />
        <Divider orientation="vertical" />
        <RoleOptions />
      </Flex>
    </Box>
  );
};

export default CreateRoles;
