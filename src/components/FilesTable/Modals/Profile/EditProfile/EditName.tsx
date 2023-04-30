import { Flex, TextInput, Button, Text } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { closeModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { useUsers } from 'hooks/useUsers';
import { useUpdateUserDataMutation } from 'store/api/user/userApi';
import { z } from 'zod';

const schema = z.object({
  displayName: z
    .string()
    .min(2, { message: 'Имя пользователя должно быть больше 2-х знаков' }),
});

export const EditName = () => {
  const currentUser = useUsers().currentUser;
  const [updateUserData] = useUpdateUserDataMutation();

  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      displayName: '',
    },

    validate: zodResolver(schema),
  });

  const submitFn = form.onSubmit(async (values) => {
    await updateUserData({
      displayname: values.displayName,
      additionalinfo: '',
      email: currentUser?.email || '',
    })
      .unwrap()
      .then(() => {
        closeModal('EditName');
        showNotification({
          title: 'Подтверждено',
          message: 'Имя пользователя успешно изменено!',
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
        Изменение имени пользователя
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
        Введите новое имя пользователя и подтвердите изменения паролем
      </Text>
      <form style={{ width: '95%', marginTop: '-10px' }} onSubmit={submitFn}>
        <Flex direction="column" mt="5px" align="flex-start" w="100%">
          <Flex direction="column" w="100%">
            <Text
              sx={{
                fontWeight: 500,
                fontSize: 15,
                marginTop: '25px',
              }}
            >
              ИМЯ ПОЛЬЗОВАТЕЛЯ
            </Text>
            <TextInput
              w="100%"
              mt="5px"
              placeholder={currentUser?.displayname || ''}
              {...form.getInputProps('displayName')}
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
              closeModal('EditName');
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
