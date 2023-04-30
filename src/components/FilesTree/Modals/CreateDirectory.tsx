import { FC } from 'react';
import { Button, Flex, Input, Text, TextInput } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';
import { useCreateDirectoryMutation } from 'store/api/directory';
import { useForm } from 'react-hook-form';

interface CreateDirectoryModalProps {
  directoryId: number | null;
}

export const CreateDirectory: FC<CreateDirectoryModalProps> = ({
  directoryId,
}) => {
  const [createDirectory] = useCreateDirectoryMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      parent: directoryId,
      webprops: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (e: {
    title: string;
    parent: number | null;
    webprops: string;
  }) => {
    try {
      createDirectory(e)
        .unwrap()
        .then(() => closeAllModals());
    } catch {}
  };

  return (
    <form
      onSubmit={handleSubmit((e) => {
        onSubmit(e);
      })}
    >
      <Flex mb={30} gap={15} align="center">
        <Text fz={18.5} fw={500}>
          Имя директории
        </Text>
        <Input.Wrapper error={errors.title?.message} sx={{ flex: 2 }}>
          <TextInput
            {...register(`title`, {
              required: 'Это поле обязательно',
              minLength: {
                value: 2,
                message:
                  'Длина имени директории должна быть не меньше 2 символов',
              },
              maxLength: {
                value: 64,
                message:
                  'Длина имени директории не должна превышать 64 символа',
              },
            })}
          />
        </Input.Wrapper>
      </Flex>
      <Flex justify="end" gap={10}>
        <Button
          variant="subtle"
          color="gray"
          onClick={() => closeAllModals()}
          sx={{ borderRadius: 8, padding: '2px 15px', fontWeight: 500 }}
        >
          Отмена
        </Button>
        <Button
          type="submit"
          sx={{ borderRadius: 8, padding: '2px 15px', fontWeight: 500 }}
        >
          Создать
        </Button>
      </Flex>
    </form>
  );
};
