import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, Text } from '@mantine/core';

export const AccessRightsTabs = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const selectedTabValue = pathname.split('/')[2];

  return (
    <Tabs
      value={selectedTabValue}
      onTabChange={(value) => navigate(`/access_rights/${value}`)}
      styles={{
        root: {
          height: 70,
        },
        tab: {
          borderBottomWidth: 5,
          transition: 'all 0.1s ease-in-out',
        },
      }}
    >
      <Tabs.List>
        <Tabs.Tab value="manage">
          <Text
            sx={(theme) => ({
              color:
                selectedTabValue === 'manage'
                  ? '#1E1E1E'
                  : theme.colors.gray[4],
              fontSize: selectedTabValue === 'manage' ? 25 : 23,
              transition: 'all 0.1s ease-in-out',
              fontWeight: 500,
            })}
          >
            Права доступа ролей
          </Text>
        </Tabs.Tab>
        <Tabs.Tab value="add">
          <Text
            sx={(theme) => ({
              color:
                selectedTabValue === 'add' ? '#1E1E1E' : theme.colors.gray[4],
              fontSize: selectedTabValue === 'add' ? 25 : 23,
              transition: 'all 0.1s ease-in-out',
              fontWeight: 500,
            })}
          >
            Создание ролей
          </Text>
        </Tabs.Tab>
        <Tabs.Tab value="approve">
          <Text
            sx={(theme) => ({
              color:
                selectedTabValue === 'approve'
                  ? '#1E1E1E'
                  : theme.colors.gray[4],
              fontSize: selectedTabValue === 'add' ? 25 : 23,
              transition: 'all 0.1s ease-in-out',
              fontWeight: 500,
            })}
          >
            Подтверждение пользователей
          </Text>
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
};
