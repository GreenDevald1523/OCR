import {
  Title,
  Box,
  Flex,
  Text,
  ActionIcon,
  Loader,
  ScrollArea,
} from '@mantine/core';
import { IconPencil, IconQuestionMark, IconUser, IconX } from '@tabler/icons';
import { useState } from 'react';
import { useRoles } from '../../../../hooks/useRoles';
import { Role, useDeleteRoleMutation } from 'store/api/role';
import { openConfirmModal } from '@mantine/modals';
import { useTypedDispatch } from 'store/ReduxHooks';
import {
  setCurrentRole,
  setCurrentRoleColor,
  setCurrentRoleId,
  setIsColorChanged,
  setShowCreateRoles,
  setShowEditRoles,
} from 'store/slices/roles';

export const ListOfRoles = (props: { rolesToDislay: string }) => {
  const dispatch = useTypedDispatch();
  const { allRoles, allRolesIsSuccess } = useRoles();

  const [userHoverName, setUserHoverName] = useState('');
  const [userHoverId, setUserHoverId] = useState(0);

  const [deleteRole] = useDeleteRoleMutation();

  const deleteRoleHandler = () => {
    openConfirmModal({
      title: 'Удаление роли',
      centered: true,
      children: (
        <Flex align="center" gap={10}>
          <Box
            sx={{
              borderRadius: '50%',
              padding: 5,
              display: 'grid',
              placeItems: 'center',
              backgroundColor: 'black',
            }}
            color="red"
          >
            <IconQuestionMark color="white" />
          </Box>
          <Text size="md">
            Вы действительно хотите удалить роль {userHoverName}?
          </Text>
        </Flex>
      ),
      labels: { confirm: 'Удалить', cancel: 'Отмена' },
      onConfirm: () => deleteRole(userHoverId),
      confirmProps: {
        sx: (theme) => ({
          borderRadius: 8,
          padding: '2px 15px',
          fontWeight: 500,
        }),
        color: 'red.5',
      },
      cancelProps: {
        variant: 'subtle',
        color: 'gray',
        sx: (theme) => ({
          borderRadius: 8,
          padding: '2px 15px',
          fontWeight: 500,
        }),
      },
    });
  };

  return (
    <Box sx={{ width: '50%', maxWidth: '800px' }}>
      {allRolesIsSuccess ? (
        <Box ta="center">
          <Loader />
        </Box>
      ) : (
        <>
          <Title order={4}>
            СПИСОК РОЛЕЙ —{' '}
            {
              allRoles.filter(
                (role) =>
                  role.name.toLowerCase() &&
                  role.name
                    .toLowerCase()
                    .includes(props.rolesToDislay.toLowerCase())
              ).length
            }
          </Title>
          <Flex
            sx={{ overflowY: 'auto', height: '50vh' }}
            direction="column"
            mt={5}
            ml="-12px"
          >
            {allRoles
              .filter(
                (role) =>
                  role.name &&
                  role.name
                    .toLowerCase()
                    .includes(props.rolesToDislay.toLocaleLowerCase())
              )
              .map((role, index) => {
                let color;
                try {
                  color =
                    JSON.parse((role || ({} as Role)).webprops).color || 'gray';
                } catch (error) {
                  color = 'indigo.5';
                }
                return (
                  <Flex
                    justify="space-between"
                    sx={{
                      borderRadius: '5px',
                      width: '100%',
                      height: '80px',
                      ':hover': { background: '#eff2ff' },
                    }}
                    p={13}
                    key={index}
                    onMouseEnter={() => {
                      setUserHoverName(role.name);
                      setUserHoverId(role.id);
                    }}
                    onMouseLeave={() => {
                      setUserHoverName('');
                      setUserHoverId(0);
                    }}
                  >
                    <Flex align="center" gap={18}>
                      <Flex
                        align="center"
                        justify="center"
                        w="57px"
                        h="57px"
                        bg={color}
                        sx={{ borderRadius: '4px' }}
                      >
                        <IconUser color="white" />
                      </Flex>
                      <Text fz={15}>{role.name}</Text>
                    </Flex>
                    {role.name === userHoverName && (
                      <Flex align="center" gap={22} pr={7}>
                        <ActionIcon
                          h={32}
                          w={32}
                          bg="white"
                          sx={{ borderRadius: 7 }}
                          onClick={() => {
                            dispatch(setCurrentRole(role.name));
                            dispatch(setCurrentRoleId(role.id));
                            dispatch(setShowCreateRoles(false));
                            dispatch(setShowEditRoles(true));
                            dispatch(setCurrentRoleColor(''));
                            dispatch(setIsColorChanged(false));
                          }}
                        >
                          <IconPencil size={18} color="black" />
                        </ActionIcon>
                        <ActionIcon
                          h={32}
                          w={32}
                          bg="white"
                          sx={{ borderRadius: 7 }}
                          onClick={deleteRoleHandler}
                        >
                          <IconX size={18} color="black" />
                        </ActionIcon>
                      </Flex>
                    )}
                  </Flex>
                );
              })}
          </Flex>
        </>
      )}
    </Box>
  );
};
