import { FC } from 'react';
import { Center, Text, Flex } from '@mantine/core';
import { RegistrationForm } from '../components/RegistrationForm/RegistrationForm';

const Register: FC = () => {
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
          Создайте аккаунт
        </Text>
      </Center>
      <RegistrationForm />
    </Flex>
  );
};

export default Register;
