import {
  Anchor,
  Button,
  Center,
  Checkbox,
  PasswordInput,
  Stack,
  TextInput,
} from '@mantine/core';
import { IconEye, IconEyeOff } from '@tabler/icons';
import { Link } from 'react-router-dom';
import { useLoginForm } from '../../hooks/useLoginForm';

export const AuthForm = () => {
  const [form, submitFn] = useLoginForm();

  return (
    <form style={{ width: '100%', maxWidth: 500 }} onSubmit={submitFn}>
      <Stack spacing={20} w={'100%'}>
        <TextInput
          name="username"
          radius="md"
          mt="20px"
          label="Логин/Почта"
          {...form.getInputProps('userName')}
        />
        <PasswordInput
          name="password"
          label="Пароль"
          visibilityToggleIcon={({ reveal }) =>
            reveal ? <IconEye color="black" /> : <IconEyeOff color="black" />
          }
          {...form.getInputProps('password')}
        />
        <Checkbox
          label="Запомнить меня"
          styles={() => ({
            input: {
              borderWidth: 2,
            },
            label: {
              fontWeight: 500,
            },
          })}
          {...form.getInputProps('rememberMe')}
        />
        <Center inline style={{ width: '100%', marginTop: '30px' }}>
          <Stack>
            <Button
              type="submit"
              style={{
                height: '45px',
                padding: '12.5px 30px',
                borderRadius: '14px',
                fontSize: '20px',
                fontWeight: '400',
              }}
            >
              Войти
            </Button>
            <Center>
              <Anchor
                color={'dimmed'}
                underline
                style={{
                  fontSize: '17px',
                }}
                component={Link}
                to="/register"
              >
                Регистрация
              </Anchor>
            </Center>
          </Stack>
        </Center>
      </Stack>
    </form>
  );
};
