import { Flex, TextInput, Button, Text } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { closeModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { useUsers } from 'hooks/useUsers';
import { useUpdateUserDataMutation } from 'store/api/user/userApi';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email({ message: 'Неверный формат email адреса' }),
});

export const EditEmail = () => {
  const currentUser = useUsers().currentUser;
  const [updateUserData] = useUpdateUserDataMutation();

  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      email: '',
    },

    validate: zodResolver(schema),
  });

  const submitFn = form.onSubmit(async (values) => {
    await updateUserData({
      displayname: currentUser?.displayname || '',
      additionalinfo: '',
      email: values.email,
    })
      .unwrap()
      .then(() => {
        closeModal('EditEmail');
        showNotification({
          title: 'Подтверждено',
          message: 'Email успешно изменён!',
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
        Изменение почты
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
        Укажите новую почту
      </Text>
      <form style={{ width: '95%', marginTop: '-15px' }} onSubmit={submitFn}>
        <Flex direction="column" mt="5px" align="flex-start" w="100%">
          <Flex direction="column" w="100%">
            <Text
              sx={{
                fontWeight: 500,
                fontSize: 15,
                marginTop: '25px',
              }}
            >
              НОВАЯ ПОЧТА
            </Text>
            <TextInput
              w="100%"
              mt="5px"
              placeholder={currentUser?.email || ''}
              {...form.getInputProps('email')}
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
              closeModal('EditEmail');
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
