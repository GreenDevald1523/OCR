import { Flex, Button, Text, PasswordInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { closeModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { IconEye, IconEyeOff } from '@tabler/icons';
import { PasswordWithForceCheckLK } from 'components/PasswordWithForceCheck/PasswordWithForceCheckLK';
import { useUpdateUserPasswordMutation } from 'store/api/user/userApi';
import { z } from 'zod';

const schema = z.object({
  new_password: z
    .string()
    .regex(
      /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/g,
      'Неверный формат пароля'
    ),
  password2: z
    .string()
    .regex(
      /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/g,
      'Пароли должны совпадать '
    ),
});

export const EditPassword = () => {
  const [updateUserPassword] = useUpdateUserPasswordMutation();

  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      old_password: '',
      new_password: '',
      password2: '',
    },

    validate: zodResolver(schema),
  });

  const password2Error =
    !form.isTouched('password2') ||
    form.getInputProps('new_password').value ===
      form.getInputProps('password2').value
      ? null
      : 'Пароли должны совпадать';

  const submitFn = form.onSubmit(async (values) => {
    await updateUserPassword({
      new_password: values.new_password,
      old_password: values.old_password,
    })
      .unwrap()
      .then(() => {
        closeModal('EditPassword');
        showNotification({
          title: 'Подтверждено',
          message: 'Пароль успешно изменен!',
          color: 'teal',
        });
      });
  });

  return (
    <Flex align="center" justify="center" direction="column">
      <Text
        sx={{
          color: 'black',
          fontWeight: 500,
          fontSize: 22,
          marginTop: '-30px',
        }}
      >
        Изменение пароля
      </Text>
      <Text
        sx={{
          textAlign: 'center',
          fontWeight: 400,
          fontSize: 15,
          color: '#ADB5BD',
          marginTop: '10px',
        }}
      >
        Введите текущий и новый пароли
      </Text>
      <form style={{ width: '95%' }} onSubmit={submitFn}>
        <Flex direction="column" mt={21} align="flex-start" w="100%">
          <Flex direction="column" w="100%" gap={21}>
            <PasswordInput
              name="old_password"
              label="ТЕКУЩИЙ ПАРОЛЬ"
              placeholder="Введите пароль..."
              visibilityToggleIcon={({ reveal }) =>
                reveal ? (
                  <IconEye color="black" />
                ) : (
                  <IconEyeOff color="black" />
                )
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
            <PasswordWithForceCheckLK
              name="new_password"
              {...form.getInputProps('new_password')}
            />
            <PasswordInput
              name="password2"
              label="ПОВТОРИТЕ ПАРОЛЬ"
              placeholder="Введите пароль..."
              visibilityToggleIcon={({ reveal }) =>
                reveal ? (
                  <IconEye color="black" />
                ) : (
                  <IconEyeOff color="black" />
                )
              }
              {...form.getInputProps('password2')}
              error={password2Error}
              styles={{
                label: {
                  fontSize: 15,
                  marginLeft: 0,
                  fontWeight: 500,
                },
              }}
            />
          </Flex>
        </Flex>
        <Flex direction="row" justify="flex-end" mt="30px" w="100%" gap={6}>
          <Button
            styles={() => ({
              root: {
                padding: '3px 12px',
                height: 30,
                fontSize: 13,
                borderRadius: 8,
                fontWeight: 400,
                background: 'none',
                color: '#A0A0A0',
              },
            })}
            variant="subtle"
            onClick={() => {
              closeModal('EditPassword');
            }}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            styles={() => ({
              root: {
                padding: '3px 12px',
                height: 30,
                fontSize: 13,
                fontWeight: 400,
                borderRadius: 8,
              },
            })}
          >
            Сохранить
          </Button>
        </Flex>
      </form>
    </Flex>
  );
};
