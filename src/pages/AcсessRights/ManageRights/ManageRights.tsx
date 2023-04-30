import { Box, Flex, Grid, Text } from '@mantine/core';
import { DirectorySelect } from 'components/DirectorySelect/DirectorySelect';
import { AssignedRolesWidget } from 'components/AssignedRolesWidget/AssignedRolesWidget';
import { RoleDirectoryWidget } from 'components/RoleDirectoryWidget/RoleDirectoryWidget';
import { useSessionStorage } from '@mantine/hooks';

export const ManageRights = () => {
  const [selectedDirectoryId, setSelectedDirectoryId] = useSessionStorage<
    string | null
  >({ key: 'admin-role-rights-selected-directory-id', defaultValue: null });
  const [selectedRoleId, setSelectedRoleId] = useSessionStorage<number | null>({
    key: 'admin-role-rights-selected-role-id',
    defaultValue: null,
  });

  return (
    <Grid
      w="100%"
      align="flex-start"
      h="calc(100% - 85px)"
      mt={15}
      p={5}
      m={-13}
    >
      <Grid.Col h={60} span={12} mb={15}>
        <Flex h="100%" align="center">
          <DirectorySelect
            value={selectedDirectoryId}
            setValue={(value) => {
              setSelectedDirectoryId(value);
              setSelectedRoleId(null);
            }}
          />
        </Flex>
      </Grid.Col>
      {selectedDirectoryId ? (
        <>
          <Grid.Col
            span={3}
            sx={{ height: 'calc(100% - 60px)', overflowY: 'auto' }}
          >
            {!!selectedDirectoryId && (
              <AssignedRolesWidget
                selectedRoleId={selectedRoleId}
                selectedDirectoryId={selectedDirectoryId}
                onChange={setSelectedRoleId}
              />
            )}
          </Grid.Col>
          <Grid.Col
            span={9}
            mah="100%"
            sx={{ height: 'calc(100% - 60px)', overflowY: 'auto' }}
          >
            <Text fz={19} fw={600} mb={15}>
              СПИСОК ПРАВ ПАПКИ
            </Text>
            {selectedDirectoryId && selectedRoleId ? (
              <RoleDirectoryWidget
                directoryId={+selectedDirectoryId}
                roleId={selectedRoleId}
              />
            ) : (
              <Box
                mah={'100%'}
                h="calc(100% - 70px)"
                sx={{
                  overflowY: 'auto',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Text color="gray.4" fw={500} fz={19}>
                  Выберите роль для настройки её прав
                </Text>
              </Box>
            )}
          </Grid.Col>
        </>
      ) : (
        <Grid.Col
          span={12}
          mah="100%"
          sx={{
            height: 'calc(100% - 60px)',
            overflowY: 'auto',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Text color="gray.4" fw={500} fz={19}>
            Выберите директорию, для которой хотите настроить права ролей
          </Text>
        </Grid.Col>
      )}
    </Grid>
  );
};

export default ManageRights;
