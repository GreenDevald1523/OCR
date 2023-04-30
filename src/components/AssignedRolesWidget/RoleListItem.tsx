import { FC, useState } from 'react';
import {
  ActionIcon,
  Avatar,
  Box,
  DefaultMantineColor,
  Flex,
  Group,
  Text,
} from '@mantine/core';

import { useTypedSelector } from 'store/ReduxHooks';
import { selectDirectoriesList } from 'store/slices/currentDirectory';

import { IconPlus, IconQuestionMark, IconUser } from '@tabler/icons';
import { useDeleteRoleRightsByDirectoryIdMutation } from 'store/api/role';
import { openConfirmModal } from '@mantine/modals';

interface RoleListItemProps {
  label: string | React.ReactNode;
  color: DefaultMantineColor | undefined;
  isActive: boolean;
  roleId: number;
  selectedDirectoryId: string;
  onClick: any;
  deletable?: boolean;
}

export const RoleListItem: FC<RoleListItemProps> = ({
  color,
  label,
  isActive,
  roleId,
  onClick,
  selectedDirectoryId,
  deletable = true,
}) => {
  const [hovered, setHovered] = useState<boolean>(false);
  const [deleteRole] = useDeleteRoleRightsByDirectoryIdMutation();

  const selectedDirectoryName = useTypedSelector(selectDirectoriesList).find(
    ({ id }) => id == selectedDirectoryId
  )?.text;

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
            Вы действительно хотите удалить роль {label} из папки «
            {selectedDirectoryName}»?
          </Text>
        </Flex>
      ),
      labels: { confirm: 'Удалить', cancel: 'Отмена' },
      onConfirm: () =>
        deleteRole({ roleId, directoryId: +selectedDirectoryId }),
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
    <Group
      spacing={17}
      mb={3}
      p={10}
      sx={(theme) => ({
        backgroundColor: isActive ? theme.colors.indigo[0] : '',
        borderRadius: 8,
        '&:hover': {
          backgroundColor: theme.fn.darken(theme.colors.indigo[0], 0.02),
        },

        '& > .mantine-Text-root': {
          flexGrow: 1,
        },
      })}
      onClick={onClick}
      onMouseOver={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Avatar variant="filled" color={color}>
        <IconUser />
      </Avatar>
      <Text
        sx={{
          userSelect: 'none',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          flexGrow: 1,
          flex: 1,
        }}
        maw="55%"
      >
        {label}
      </Text>
      {(isActive || hovered) && deletable ? (
        <ActionIcon
          variant="filled"
          radius="xl"
          color="gray.0"
          ml="auto"
          onClick={deleteRoleHandler}
        >
          <IconPlus style={{ transform: 'rotate(45deg)' }} color="black" />
        </ActionIcon>
      ) : null}
    </Group>
  );
};
