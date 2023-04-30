import { FC, useMemo, useState } from 'react';
import { RoleListItem } from '../RoleListItem';
import { closeAllModals } from '@mantine/modals';
import { Button, Flex, ScrollArea, TextInput } from '@mantine/core';
import {
  useGetAllRolesQuery,
  useGetAllRolesRelatedToDirectoryQuery,
  useGiveRoleRightsByDirectoryIdMutation,
} from 'store/api/role';

interface AllRolesListProps {
  selectedDirectoryId: string;
}

export const AllRolesList: FC<AllRolesListProps> = ({
  selectedDirectoryId,
}) => {
  const AllGroupsInfo = useGetAllRolesQuery();
  const AllRelatedRoles = useGetAllRolesRelatedToDirectoryQuery({
    directoryId: +selectedDirectoryId,
  });
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  const [filterInput, setFilterInput] = useState<string>('');

  const [postRoleRights] = useGiveRoleRightsByDirectoryIdMutation();

  const filteredRoles = useMemo(
    () =>
      (AllRelatedRoles.data &&
        AllGroupsInfo.data &&
        AllGroupsInfo.data.filter((role, index) => {
          if (
            AllRelatedRoles.data &&
            role.name.toLowerCase().includes(filterInput.toLowerCase())
          ) {
            return (
              AllRelatedRoles.data.findIndex(
                (relatedRole) => relatedRole.id === role.id
              ) === -1
            );
          }
        })) ||
      [],
    [AllGroupsInfo.data, AllRelatedRoles.data, filterInput]
  );

  return (
    <>
      <TextInput
        mb={10}
        placeholder="Название роли"
        value={filterInput}
        onChange={(e) => setFilterInput(e.target.value)}
        styles={(theme) => ({
          input: {
            fontSize: 14,
            height: 40,
          },
        })}
      />
      <ScrollArea style={{ height: '30vh', maxHeight: 500 }}>
        <Flex direction="column" sx={{ overflowY: 'auto' }}>
          {filteredRoles.map((group) => {
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
                color={color}
                deletable={false}
                isActive={selectedRoleId === group.id}
                selectedDirectoryId={selectedDirectoryId}
                onClick={() => setSelectedRoleId(group.id)}
              />
            );
          })}
        </Flex>
      </ScrollArea>
      <Flex direction="row-reverse" mt="sm" gap={10}>
        <Button
          onClick={() => {
            if (
              !selectedDirectoryId ||
              !+selectedDirectoryId ||
              !selectedRoleId
            )
              return;
            postRoleRights({
              directoryId: +selectedDirectoryId,
              roleId: selectedRoleId,
            })
              .unwrap()
              .then(() => closeAllModals());
          }}
          disabled={
            !selectedDirectoryId || !+selectedDirectoryId || !selectedRoleId
          }
          sx={{
            fontWeight: 400,
            borderRadius: '8px',
          }}
        >
          Добавить
        </Button>
        <Button
          variant="subtle"
          color="gray"
          sx={{
            border: 'none',
            fontWeight: 400,
            borderRadius: '8px',
          }}
          onClick={() => closeAllModals()}
        >
          Отменить
        </Button>
      </Flex>
    </>
  );
};
