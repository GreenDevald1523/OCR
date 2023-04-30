import {
  Text,
  Input,
  Title,
  Flex,
  ActionIcon,
  FocusTrap,
  Button,
  ScrollArea,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconSearch, IconX } from '@tabler/icons';
import { FC, useState } from 'react';
import { useUsers } from '../../../../hooks/useUsers';
import {
  useAddRoleMutation,
  useAddUsersToRoleByIdMutation,
} from 'store/api/role';
import { useTypedDispatch, useTypedSelector } from 'store/ReduxHooks';
import {
  selectCurrentRoleColor,
  setCurrentRoleColor,
  setIsColorChanged,
  setShowCreateRoles,
} from 'store/slices/roles';
import { ColorPicker } from './ColorPicker/ColorPicker';
import { colors } from './ColorPicker/Colors';

export const AddNewRole: FC = () => {
  const allUsers = useUsers().allUsers || [];
  const [userHoverId, setUserHoverId] = useState(0);

  const dispatch = useTypedDispatch();
  const currentRoleColor = useTypedSelector(selectCurrentRoleColor);

  const [foundName, setFoundName] = useState('');
  const [active, handlers] = useDisclosure(false);
  const [addRole] = useAddRoleMutation();
  const [addUsersToRoleById] = useAddUsersToRoleByIdMutation();

  const [allCurrentRoleUsersId, setAllCurrentRoleUsersId] = useState<number[]>(
    []
  );
  const [nameOfNewRole, setNameOfNewRole] = useState('');

  const addRoleHanlder = async () => {
    const chosenColor = currentRoleColor
      ? currentRoleColor
      : `{"color": "${colors[Math.floor(Math.random() * 11)]}"}`;
    const payload = await addRole({
      name: nameOfNewRole,
      description: '',
      webprops: chosenColor,
    }).unwrap();
    allCurrentRoleUsersId.forEach((userId) => {
      addUsersToRoleById({ group_id: payload.id, user_id: userId });
    });
    dispatch(setShowCreateRoles(false));
    dispatch(setCurrentRoleColor(''));
    showNotification({
      title: 'Подтверждено',
      color: 'teal',
      icon: <IconCheck size={16} />,
      message: 'Успешно добавлена роль!',
    });
  };

  return (
    <>
      <Title order={5} mb="24px">
        СОЗДАНИЕ РОЛИ
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
                height: '40px',
                fontSize: 15,
                borderRadius: '11px',
                padding: '14.5px 21px',
              },
            }}
            value={nameOfNewRole}
            onChange={(e: any) => {
              setNameOfNewRole(e.target.value);
            }}
            placeholder="Назовите роль..."
          />
        </Input.Wrapper>

        <Flex direction="column" gap={29}>
          <Flex direction="column" gap={14}>
            <Text fz={17}>Цвет роли</Text>
            <ColorPicker />
          </Flex>
          <Flex direction="column" gap={11}>
            <FocusTrap active={active}>
              <Input.Wrapper
                styles={{
                  label: {
                    fontSize: 17,
                    fontWeight: 400,
                    marginBottom: 10,
                  },
                }}
                sx={{ width: '85%', maxWidth: '600px' }}
                label={`Участники — ${allCurrentRoleUsersId.length}`}
              >
                <Input
                  styles={{
                    input: {
                      width: '100%',
                      height: '40px',
                      fontSize: 15,
                      borderRadius: '11px',
                      padding: '14.5px 21px',
                    },
                    rightSection: {
                      paddingRight: 16,
                    },
                  }}
                  value={foundName}
                  placeholder="Введите имя пользователя"
                  rightSection={<IconSearch size={18} color="#CED4DA" />}
                  onChange={(e: any) => setFoundName(e.target.value)}
                />
              </Input.Wrapper>
            </FocusTrap>

            <Flex direction="column" ml="-12px">
              {allCurrentRoleUsersId.length > 0 && (
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
                  {!foundName &&
                    allUsers
                      .filter((user) => allCurrentRoleUsersId.includes(user.id))
                      .map((user, index) => (
                        <Flex
                          justify="space-between"
                          sx={{
                            borderRadius: 5,
                            width: '100%',
                            height: 80,
                            ':hover': { background: '#eff2ff' },
                          }}
                          ml={13}
                          p={13}
                          key={index}
                          onMouseEnter={() => {
                            setUserHoverId(user.id);
                          }}
                          onMouseLeave={() => {
                            setUserHoverId(0);
                          }}
                        >
                          <Flex align="center" gap={18}>
                            <Flex
                              align="center"
                              justify="center"
                              w="57px"
                              h="57px"
                              bg={
                                JSON.parse(
                                  currentRoleColor || '{"color": "gray"}'
                                ).color
                              }
                              sx={{ borderRadius: '4px' }}
                            >
                              <Text c="white" fz={16}>
                                {user.displayname
                                  .split(' ')
                                  .map((partOfName) =>
                                    partOfName[0].toUpperCase()
                                  )}
                              </Text>
                            </Flex>
                            <Text fz={16}>{user.displayname}</Text>
                          </Flex>
                          {user.id === userHoverId && (
                            <Flex align="center" gap={22} pr={7}>
                              <ActionIcon
                                h={32}
                                w={32}
                                bg="white"
                                sx={{ borderRadius: 100 }}
                                onClick={() => {
                                  setAllCurrentRoleUsersId(
                                    allCurrentRoleUsersId.filter(
                                      (id) => id !== user.id
                                    )
                                  );
                                  setFoundName('');
                                }}
                              >
                                <IconX size={18} color="black" />
                              </ActionIcon>
                            </Flex>
                          )}
                        </Flex>
                      ))}
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
                        ml={13}
                        p={13}
                        key={index}
                        onMouseEnter={() => {
                          setUserHoverId(user.id);
                        }}
                        onMouseLeave={() => {
                          setUserHoverId(0);
                        }}
                        onClick={() => {
                          if (!allCurrentRoleUsersId.includes(user.id)) {
                            setAllCurrentRoleUsersId([
                              ...allCurrentRoleUsersId,
                              user.id,
                            ]);
                          } else {
                            showNotification({
                              title: 'Ошибка',
                              color: 'red',
                              icon: <IconX size={16} />,
                              message:
                                'Такой пользователь уже имеет данную роль',
                            });
                          }

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
                              allCurrentRoleUsersId.includes(user.id)
                                ? JSON.parse(
                                    currentRoleColor || '{ "color": "gray" }'
                                  ).color
                                : 'gray'
                            }
                            sx={{ borderRadius: '4px' }}
                          >
                            <Text c="white" fz={16}>
                              {user.displayname
                                .split(' ')
                                .map((partOfName) =>
                                  partOfName[0].toUpperCase()
                                )}
                            </Text>
                          </Flex>
                          <Text fz={16}>{user.displayname}</Text>
                        </Flex>
                        {user.id === userHoverId && (
                          <Flex align="center" gap={22} pr={7}>
                            {allCurrentRoleUsersId.includes(user.id) && (
                              <ActionIcon
                                h={32}
                                w={32}
                                bg="white"
                                sx={{ borderRadius: 100 }}
                                onClick={() => {
                                  setAllCurrentRoleUsersId(
                                    allCurrentRoleUsersId.filter(
                                      (id) => id !== user.id
                                    )
                                  );
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

              {allCurrentRoleUsersId.length > 0 && nameOfNewRole && (
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
                      setNameOfNewRole('');
                      setAllCurrentRoleUsersId([]);
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
                    onClick={() => addRoleHanlder()}
                  >
                    Сохранить
                  </Button>
                </Flex>
              )}
            </Flex>
            {!foundName && allCurrentRoleUsersId.length === 0 && (
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
  );
};
