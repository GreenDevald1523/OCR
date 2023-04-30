import { Button, Center, PasswordInput, Stack } from '@mantine/core';
import { PasswordWithForceCheck } from '../PasswordWithForceCheck/PasswordWithForceCheck';
import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';
import {
  useGetClientUserQuery,
  useUpdateUserPasswordMutation,
} from 'store/api/user/userApi';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { IconEye, IconEyeOff } from '@tabler/icons';

const schema = z.object({
  new_password: z
    .string()
    .regex(
      /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/g,
      'Неверный формат пароля'
    ),
});

export const ChangePasswordForm = () => {
  const form = useForm({
    initialValues: {
      new_password: '',
      old_password: '',
    },
    validate: zodResolver(schema),
  });

  const navigate = useNavigate();

  const [updatePassword] = useUpdateUserPasswordMutation();

  const ClientUser = useGetClientUserQuery();

  const onSubmitFn = (values: {
    new_password: string;
    old_password: string;
  }) => {
    updatePassword(values)
      .unwrap()
      .then(() => {
        ClientUser.refetch();
      })
      .catch(() => {
        form.setErrors({
          new_password: ' ',
          old_password: ' ',
        });

        setTimeout(() => form.clearErrors(), 650);
      });
  };

  useEffect(() => {
    if (ClientUser.data && ClientUser.data.allowed) navigate('/home');
  }, [ClientUser.data, navigate]);

  return (
    <form
      style={{ width: '100%', maxWidth: 500 }}
      onSubmit={form.onSubmit(onSubmitFn)}
    >
      <Stack spacing={20} w={'100%'}>
        <PasswordInput
          name="old_password"
          label="Текущий пароль"
          placeholder="Введите пароль..."
          visibilityToggleIcon={({ reveal }) =>
            reveal ? <IconEye color="black" /> : <IconEyeOff color="black" />
          }
          {...form.getInputProps('old_password')}
          styles={{
            label: {
              fontSize: 15,
              marginLeft: 0,
              fontWeight: 500,
            },
          }}
        />
        <PasswordWithForceCheck
          name="new_password"
          label="Новый пароль"
          placeholder="Введите пароль..."
          {...form.getInputProps('new_password')}
        />
        <Center inline style={{ width: '100%', marginTop: '30px' }}>
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
            Подтвердить
          </Button>
        </Center>
      </Stack>
    </form>
  );
};
