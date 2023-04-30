import { FC, memo } from 'react';

import { ActionIcon, Flex, Group, ScrollArea, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons';
import { useGetAllRolesRelatedToDirectoryQuery } from 'store/api/role/';
import { RoleListItem } from './RoleListItem';
import { openModal } from '@mantine/modals';
import { AllRolesList } from './Modals/AllRolesList';

interface AssignedRolesWidgetProps {
  selectedRoleId: number | null;
  selectedDirectoryId: string;
  onChange: React.Dispatch<number | null>;
}

export const AssignedRolesWidget: FC<AssignedRolesWidgetProps> = memo(
  ({ selectedRoleId, onChange, selectedDirectoryId }) => {
    const AllGroupsInfo = useGetAllRolesRelatedToDirectoryQuery({
      directoryId: +selectedDirectoryId,
    });

    return (
      <Flex direction="column">
        <Group mb={10}>
          <Text fz={19} fw={600}>
            РОЛИ
          </Text>
          <ActionIcon
            sx={(theme) => ({
              backgroundColor: theme.colors.indigo[0],

              '&:hover': {
                backgroundColor: theme.colors.indigo[1],
              },
            })}
            radius="xl"
            onClick={() =>
              openModal({
                centered: true,
                size: '30%',
                title: 'Добавление роли прав на директорию',
                children: (
                  <AllRolesList selectedDirectoryId={selectedDirectoryId} />
                ),
              })
            }
          >
            <IconPlus size={18} strokeWidth={3} color="black" />
          </ActionIcon>
        </Group>
        {AllGroupsInfo?.data && (
          <ScrollArea
            style={{
              height: '100%',
              paddingRight: 30,
            }}
          >
            {AllGroupsInfo.data.map((group) => {
              let color;

              try {
                color = JSON.parse(group.webprops)?.color || 'gray';
              } catch (error) {
                color = 'indigo.5';
              }
              return (
                <RoleListItem
                  key={group.name}
                  label={group.name}
                  roleId={group.id}
                  deletable={true}
                  selectedDirectoryId={selectedDirectoryId}
                  color={color}
                  isActive={selectedRoleId === group.id}
                  onClick={() => onChange(group.id)}
                />
              );
            })}
          </ScrollArea>
        )}
      </Flex>
    );
  }
);

AssignedRolesWidget.displayName = 'AssignedRolesWidget';
