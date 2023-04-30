import { FC } from 'react';
import { Center, Flex, Text } from '@mantine/core';
import { useTypedSelector } from 'store/ReduxHooks';
import { selectIsAllowed, selectRefreshToken } from 'store/slices/authSlice';
import { Navigate } from 'react-router-dom';
import { AuthForm } from '../components/AuthForm/AuthForm';

const Auth: FC = () => {
  const refreshToken = useTypedSelector(selectRefreshToken);
  const isAllowed = useTypedSelector(selectIsAllowed);

  if (refreshToken && isAllowed) {
    return <Navigate to={'/home'} replace />;
  }

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
            fontSize: 40,
            marginBottom: 24,
          })}
        >
          Добро пожаловать
        </Text>
      </Center>
      <AuthForm />
    </Flex>
  );
};

export default Auth;
