import { useLayoutEffect } from 'react';
import { Center, Flex, Text } from '@mantine/core';
import { ChangePasswordForm } from '../components/ChangePasswordForm/ChangePasswordForm';
import { useGetClientUserQuery } from 'store/api/user/userApi';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const navigate = useNavigate();
  const ClientUser = useGetClientUserQuery();

  useLayoutEffect(() => {
    if (ClientUser.data && !ClientUser.data.superuser) {
      navigate('/auth');
    }
  }, [ClientUser.data, navigate]);

  return (
    <Flex
      direction="column"
      justify="center"
      align={'center'}
      px={16}
      sx={{ height: '100%' }}
    >
      <Center>
        <Text
          align="center"
          sx={(theme) => ({
            color: theme.colors.indigo[9],
            fontSize: 30,
            marginBottom: 24,
          })}
        >
          Введите новый пароль для суперпользователя
        </Text>
      </Center>
      <ChangePasswordForm />
    </Flex>
  );
};

export default ChangePassword;
