import {
  Title,
  Flex,
  Input,
  Text,
  Box,
  Loader,
  ActionIcon,
  FocusTrap,
  Button,
  ScrollArea,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { openConfirmModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconQuestionMark, IconSearch, IconX } from '@tabler/icons';
import { FC, useState } from 'react';
import { useRoles } from '../../../../hooks/useRoles';
import { useUsers } from '../../../../hooks/useUsers';
import {
  Role,
  useAddUsersToRoleByIdMutation,
  useDeleteUsersToRoleByIdMutation,
  useEditRoleMutation,
  UserByRoleId,
} from 'store/api/role';
import { useTypedDispatch, useTypedSelector } from 'store/ReduxHooks';
import {
  selectCurrentRoleColor,
  setCurrentRoleColor,
  setIsColorChanged,
  setShowEditRoles,
} from 'store/slices/roles';
import { ColorPicker } from './ColorPicker/ColorPicker';

export const EditRoles: FC = () => {
  const allUsers = useUsers().allUsers || [];
  const {
    currentRole,
    usersByCurrentRoleId,
    usersIdsByCurrentRoleId,
    usersByCurrentRoleIdIsSuccess,
  } = useRoles();
  const [editRole] = useEditRoleMutation();
  const [deleteUsersToRoleById] = useDeleteUsersToRoleByIdMutation();
  const [addUsersToRoleById] = useAddUsersToRoleByIdMutation();

  const [active, handlers] = useDisclosure(false);

  const dispatch = useTypedDispatch();
  const currentRoleColor = useTypedSelector(selectCurrentRoleColor);

  const [userHoverId, setUserHoverId] = useState(0);

  const [foundName, setFoundName] = useState('');
  const [nameOfNewRole, setNameOfNewRole] = useState('');

  const deleteUserHandler = (
    user: UserByRoleId & {
      id: number;
    }
  ) => {
    openConfirmModal({
      title: 'Удаление пользователя',
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
            Вы действительно хотите удалить пользователя {user.displayname}?
          </Text>
        </Flex>
      ),
      labels: { confirm: 'Удалить', cancel: 'Отмена' },
      onConfirm: () => {
        deleteUsersToRoleById({
          group_id: currentRole.id,
          user_id: user.id,
        })
          .unwrap()
          .then(() => {
            dispatch(setCurrentRoleColor(''));
          });
      },
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

  const editRoleHandler = () => {
    openConfirmModal({
      title: 'Редактирование роли',
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
          >
            <IconQuestionMark color="white" />
          </Box>
          <Text size="md">
            Вы действительно хотите изменить роль {currentRole.name}?
          </Text>
        </Flex>
      ),
      labels: { confirm: 'Изменить', cancel: 'Отмена' },
      onConfirm: () => {
        console.log(
          JSON.stringify(JSON.parse((currentRole || ({} as Role)).webprops))
        );
        editRole({
          group_id: currentRole.id,
          name: nameOfNewRole.length ? nameOfNewRole : currentRole.name,
          description: '',
          webprops: currentRoleColor
            ? currentRoleColor
            : JSON.stringify(
                JSON.parse((currentRole || ({} as Role)).webprops)
              ),
        })
          .unwrap()
          .then((res) => {
            dispatch(setShowEditRoles(false));
            dispatch(setCurrentRoleColor(''));
            dispatch(setIsColorChanged(false));
            showNotification({
              title: 'Подтверждено',
              color: 'teal',
              icon: <IconCheck size={16} />,
              message: 'Роль успешно изменена!',
            });
          });
      },
      confirmProps: {
        sx: () => ({
          borderRadius: 8,
          padding: '2px 15px',
          fontWeight: 500,
        }),
      },
      cancelProps: {
        variant: 'subtle',
        color: 'gray',
        sx: () => ({
          borderRadius: 8,
          padding: '2px 15px',
          fontWeight: 500,
        }),
      },
    });
  };

  return (
    <>
      {usersByCurrentRoleIdIsSuccess ? (
        <Box ta="center">
          <Loader />
        </Box>
      ) : (
        <>
          <Title order={4} mb="24px">
            РЕДАКТИРОВАНИЕ РОЛИ - {(currentRole || ({} as Role)).name}
          </Title>
          <ScrollArea type="always" style={{ height: '58vh' }}>
            <Input.Wrapper
              styles={{
                label: {
                  fontSize: 17,
                  fontWeight: 400,
                  marginBottom: '10px',
                },
              }}
              sx={{ width: '85%', maxWidth: '600px' }}
              mb={17}
              label="Название роли"
            >
              <Input
                styles={{
                  input: {
                    width: '100%',
                    height: '45px',
                    fontSize: 15,
                    borderRadius: '11px',
                    padding: '14.5px 21px',
                  },
                }}
                value={nameOfNewRole}
                onChange={(e: any) => {
                  setNameOfNewRole(e.target.value);
                }}
                placeholder={currentRole?.name}
              />
            </Input.Wrapper>
            <Flex direction="column" gap={29}>
              <Flex direction="column" gap={14}>
                <Text fz={17}>Цвет роли</Text>
                <ColorPicker
                  currentColor={
                    JSON.parse((currentRole || ({} as Role)).webprops).color ||
                    'gray'
                  }
                />
              </Flex>
              <Flex direction="column">
                <FocusTrap active={active}>
                  <Input.Wrapper
                    styles={{
                      label: {
                        fontSize: 17,
                        fontWeight: 400,
                        marginBottom: '10px',
                      },
                    }}
                    mb={11}
                    sx={{ width: '85%', maxWidth: '600px' }}
                    label={`Участники — ${usersByCurrentRoleId.length}`}
                  >
                    <Input
                      styles={{
                        input: {
                          width: '100%',
                          height: '45px',
                          fontSize: 15,
                          borderRadius: '11px',
                          padding: '14.5px 21px',
                        },
                        rightSection: {
                          marginRight: '10px',
                        },
                      }}
                      value={foundName}
                      onChange={(e: any) => setFoundName(e.target.value)}
                      placeholder="Введите имя пользователя"
                      rightSection={<IconSearch size={22} color="#CED4DA" />}
                    />
                  </Input.Wrapper>
                </FocusTrap>
                <Flex direction="column" ml="-12px">
                  {usersByCurrentRoleId.length > 0 && !foundName && (
                    <ScrollArea
                      type="hover"
                      offsetScrollbars
                      sx={{
                        maxWidth: 600,
                        width: '85%',
                        maxHeight: 260,
                        overflowY: 'auto',
                      }}
                      styles={{
                        scrollbar: {
                          display: 'none',
                        },
                      }}
                    >
                      {usersByCurrentRoleId
                        .filter(
                          (user) =>
                            user.displayname &&
                            user.displayname
                              .toLowerCase()
                              .includes(foundName.toLowerCase())
                        )
                        .map((user, index) => {
                          let color;
                          try {
                            color =
                              JSON.parse((currentRole || ({} as Role)).webprops)
                                .color || 'gray';
                          } catch (error) {
                            color = 'indigo.5';
                          }
                          return (
                            <Flex
                              sx={{
                                borderRadius: 5,
                                width: '100%',
                                height: 80,
                                ':hover': { background: '#eff2ff' },
                              }}
                              ml={13}
                              p={13}
                              key={index}
                              align="center"
                              justify="space-between"
                              onMouseEnter={() => setUserHoverId(user.id)}
                              onMouseLeave={() => setUserHoverId(0)}
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
                                  <Text c="white" fz={25}>
                                    {user.displayname
                                      .split(' ')
                                      .map((partOfName) =>
                                        partOfName[0].toUpperCase()
                                      )}
                                  </Text>
                                </Flex>
                                <Text fz={18}>{user.displayname}</Text>
                              </Flex>
                              {user.id === userHoverId && (
                                <ActionIcon
                                  h={32}
                                  w={32}
                                  mr={15}
                                  bg="white"
                                  sx={{ borderRadius: '100%' }}
                                  onClick={() => {
                                    deleteUserHandler(user);
                                  }}
                                >
                                  <IconX size={18} color="black" />
                                </ActionIcon>
                              )}
                            </Flex>
                          );
                        })}
                    </ScrollArea>
                  )}

                  {foundName && (
                    <ScrollArea
                      type="hover"
                      offsetScrollbars
                      sx={{
                        maxWidth: 600,
                        width: '85%',
                        maxHeight: 260,
                        overflowY: 'auto',
                      }}
                      styles={{
                        scrollbar: {
                          display: 'none',
                        },
                      }}
                    >
                      {allUsers
                        .filter(
                          (user) =>
                            foundName.toLowerCase() &&
                            user.displayname
                              .toLowerCase()
                              .includes(foundName.toLowerCase())
                        )
                        .map((user, index) => (
                          <Flex
                            justify="space-between"
                            sx={{
                              borderRadius: 5,
                              width: '100%',
                              height: 80,
                              ':hover': { background: '#eff2ff' },
                            }}
                            p={13}
                            ml={13}
                            key={index}
                            onMouseEnter={() => {
                              setUserHoverId(user.id);
                            }}
                            onMouseLeave={() => {
                              setUserHoverId(0);
                            }}
                            onClick={() => {
                              addUsersToRoleById({
                                group_id: currentRole.id,
                                user_id: user.id,
                              });
                              setFoundName('');
                            }}
                          >
                            <Flex align="center" gap={18}>
                              <Flex
                                align="center"
                                justify="center"
                                w="57px"
                                h="57px"
                                bg={
                                  usersIdsByCurrentRoleId.includes(user.id)
                                    ? JSON.parse(
                                        (currentRole || ({} as Role)).webprops
                                      ).color
                                    : 'gray'
                                }
                                sx={{ borderRadius: '4px' }}
                              >
                                <Text c="white" fz={25}>
                                  {user.displayname
                                    .split(' ')
                                    .map((partOfName) =>
                                      partOfName[0].toUpperCase()
                                    )}
                                </Text>
                              </Flex>
                              <Text fz={18}>{user.displayname}</Text>
                            </Flex>
                            {user.id === userHoverId && (
                              <Flex align="center" gap={22} pr={7}>
                                {usersIdsByCurrentRoleId.includes(user.id) && (
                                  <ActionIcon
                                    h={32}
                                    w={32}
                                    bg="white"
                                    sx={{ borderRadius: 100 }}
                                    onClick={() => {
                                      deleteUserHandler(user);
                                      setFoundName('');
                                    }}
                                  >
                                    <IconX size={18} color="black" />
                                  </ActionIcon>
                                )}
                              </Flex>
                            )}
                          </Flex>
                        ))}
                    </ScrollArea>
                  )}
                  {usersByCurrentRoleId.length > 0 && (
                    <Flex mr={100} mt={10} gap={16} justify="end">
                      <Button
                        variant="outline"
                        sx={{
                          border: 'none',
                          bg: 'none',
                          color: '#A0A0A0',
                          fontWeight: 400,
                          borderRadius: '8px',
                          '&:hover': {
                            background: '#EDF2FF',
                          },
                        }}
                        onClick={() => {
                          dispatch(setShowEditRoles(false));
                          dispatch(setCurrentRoleColor(''));
                          dispatch(setIsColorChanged(false));
                        }}
                      >
                        Отменить
                      </Button>
                      <Button
                        sx={{
                          fontWeight: 400,
                          borderRadius: '8px',
                        }}
                        onClick={() => editRoleHandler()}
                      >
                        Сохранить
                      </Button>
                    </Flex>
                  )}
                </Flex>

                {usersByCurrentRoleId.length === 0 && (
                  <Text fw={500} fz={15}>
                    У данной роли нет участников.{' '}
                    <Text
                      onClick={handlers.toggle}
                      sx={{ cursor: 'pointer' }}
                      span
                      c="#4C6EF5"
                    >
                      Назначьте участников.
                    </Text>
                  </Text>
                )}
              </Flex>
            </Flex>
          </ScrollArea>
        </>
      )}
    </>
  );
};
