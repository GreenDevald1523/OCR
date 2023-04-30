import { Link } from 'react-router-dom';
import { PasswordWithForceCheck } from '../PasswordWithForceCheck/PasswordWithForceCheck';
import {
  Stack,
  TextInput,
  PasswordInput,
  Center,
  Button,
  Text,
  Anchor,
  Space,
  Flex,
  Tooltip,
} from '@mantine/core';
import { IconEye, IconEyeOff } from '@tabler/icons';
import { useRegisterForm } from '../../hooks/useRegisterForm';
import { ReactComponent as Question } from '../../assets/SVG/Question.svg';

export const RegistrationForm = () => {
  const [form, submitFn, password2Error, isLoading] = useRegisterForm();

  return (
    <form style={{ width: '100%', maxWidth: 500 }} onSubmit={submitFn}>
      <Stack spacing={20} w={'100%'}>
        <TextInput
          name="username"
          w="100%"
          label={
            <Tooltip label="Уникальное имя">
              <Flex gap={15} align="center">
                <Text>Логин</Text>
                <Question />
              </Flex>
            </Tooltip>
          }
          placeholder="Логин"
          {...form.getInputProps('userName')}
        />
        <TextInput
          name="displayname"
          w="100%"
          label={
            <Tooltip label="Отображаемое имя">
              <Flex gap={15} align="center">
                <Text>Имя пользователя</Text>
                <Question />
              </Flex>
            </Tooltip>
          }
          placeholder="Иванов Иван"
          {...form.getInputProps('displayName')}
        />
        <TextInput
          name="email"
          label="Почта"
          placeholder="Почта"
          {...form.getInputProps('email')}
        />
        <PasswordWithForceCheck
          name="password"
          {...form.getInputProps('password')}
        />
        <PasswordInput
          name="password2"
          label="Повторите пароль"
          placeholder="Повторить пароль"
          visibilityToggleIcon={({ reveal }) =>
            reveal ? <IconEye color="black" /> : <IconEyeOff color="black" />
          }
          {...form.getInputProps('password2')}
          error={password2Error}
        />
      </Stack>
      <Stack sx={{ marginTop: 45 }}>
        <Center>
          <Button
            type="submit"
            sx={{
              height: '45px',
              borderRadius: '14px',
              fontSize: '20px',
              fontWeight: 400,
            }}
            disabled={isLoading}
          >
            Регистрация
          </Button>
        </Center>
        <Center>
          <Text
            color="dimmed"
            style={{
              fontSize: '18px',
            }}
          >
            Уже есть аккаунт?
          </Text>
          <Space w="xs" />
          <Anchor
            color={'dimmed'}
            underline
            style={{
              fontSize: '18px',
            }}
            component={Link}
            to="/auth"
          >
            Войти
          </Anchor>
        </Center>
      </Stack>
    </form>
  );
};
