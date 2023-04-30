import { Text, Button, Flex, Divider } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { useUsers } from 'hooks/useUsers';
import { EditEmail } from './EditProfile/EditEmail';
import { EditName } from './EditProfile/EditName';
import { EditPassword } from './EditProfile/EditPassword';

export const Profile = () => {
  const currentUser = useUsers().currentUser;
  const currentUserRoles = useUsers().currentUserRoles;

  return (
    <>
      <Flex align="center" direction="row" sx={{ marginTop: '-40px' }}>
        <Flex
          align="center"
          justify="center"
          w="40px"
          h="40px"
          bg="#F5F5F5"
          sx={{ borderRadius: '3px' }}
        >
          <Text
            sx={{
              color: 'black',
              fontWeight: 400,
              marginLeft: '4px',
            }}
            fz={20}
          >
            {currentUser?.displayname
              .split(' ')
              .map((partOfName) => partOfName[0].toUpperCase())}
          </Text>
        </Flex>
        <Text
          sx={{
            color: 'black',
            fontWeight: 400,
            fontSize: 17,
            marginLeft: '6px',
          }}
        >
          {currentUser?.displayname}
        </Text>
      </Flex>
      <Divider my="md" />
      <Flex direction="row" justify="space-between">
        <Flex direction="column" gap={35}>
          <Flex direction="column" gap={9}>
            <Text
              sx={{
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              ИМЯ ПОЛЬЗОВАТЕЛЯ
            </Text>
            <Text
              sx={{
                fontWeight: 400,
                fontSize: 14,
              }}
            >
              {currentUser?.displayname}
            </Text>
          </Flex>
          <Flex direction="column" gap={9}>
            <Text
              sx={{
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              ЭЛЕКТРОННАЯ ПОЧТА
            </Text>
            <Text
              sx={{
                fontWeight: 400,
                fontSize: 14,
              }}
            >
              {currentUser?.email}
            </Text>
          </Flex>
          <Flex direction="column" gap={9}>
            <Text
              sx={{
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              ПАРОЛЬ
            </Text>
            <Text>******</Text>
          </Flex>
        </Flex>
        <Flex direction="column">
          <Button
            sx={{
              borderRadius: 10,
            }}
            mt="15px"
            onClick={() => {
              openModal({
                modalId: 'EditName',
                centered: true,
                children: <EditName />,
              });
            }}
          >
            Изменить
          </Button>
          <Button
            sx={{
              borderRadius: 10,
            }}
            mt="50px"
            onClick={() => {
              openModal({
                modalId: 'EditEmail',
                centered: true,
                children: <EditEmail />,
              });
            }}
          >
            Изменить
          </Button>
          <Button
            sx={{
              borderRadius: 10,
            }}
            mt="50px"
            onClick={() => {
              openModal({
                modalId: 'EditPassword',
                centered: true,
                children: <EditPassword />,
              });
            }}
          >
            Изменить
          </Button>
        </Flex>
      </Flex>
      <Text
        sx={{
          fontWeight: 600,
          fontSize: 15,
          marginTop: '17px',
        }}
      >
        РОЛИ
      </Text>
      <Flex wrap="wrap">
        {currentUserRoles.length > 0 ? (
          currentUserRoles.map((role) => (
            <Flex
              key={role.id}
              sx={{
                marginTop: '15px',
                borderRadius: 5,
                marginRight: 15,
                background: '#DBE4FF',
                minWidth: 60,
                height: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                sx={{
                  fontWeight: 500,
                  fontSize: 15,
                  marginLeft: 10,
                  marginRight: 10,
                }}
              >
                {role.name}
              </Text>
            </Flex>
          ))
        ) : (
          <Text
            sx={{
              fontWeight: 400,
              fontSize: 14,
              color: '#ADB5BD',
            }}
          >
            Роли отсутствуют
          </Text>
        )}
      </Flex>
      <Text sx={{ marginTop: 20, fontWeight: 600, fontSize: 15 }}>
        ДОП. ИНФОРМАЦИЯ
      </Text>
      <Text
        sx={{
          fontWeight: 400,
          fontSize: 14,
          color: '#ADB5BD',
        }}
      >
        Дополнительная информация отсутствует
      </Text>
    </>
  );
};
