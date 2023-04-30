import { Button, Flex, TextInput } from '@mantine/core';
import { closeModal, openModal } from '@mantine/modals';
import { useForm } from 'react-hook-form';
import { useTypedDispatch, useTypedSelector } from 'store/ReduxHooks';
import {
  setNewSchemeName,
  selectNewSchemeName,
  clearNewScheme,
} from 'store/slices/newSchemeSlice/newSchemeSlice';
import { AddField } from './AddField';

export const AddNewType = () => {
  const dispatch = useTypedDispatch();
  const newSchemeName = useTypedSelector(selectNewSchemeName);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: 'onBlur',
  });

  const onSubmit = async () => {
    openModal({
      modalId: 'addField',
      closeOnEscape: false,
      centered: true,
      children: <AddField />,
      styles: {
        modal: {
          width: '700px',
        },
      },
      onClose: () => {
        dispatch(clearNewScheme());
      },
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          value={newSchemeName}
          styles={{
            label: {
              fontSize: 14,
              margin: 0,
            },
            input: {
              fontSize: 14,
              height: 36,
              borderRadius: 4,
              backgroundColor: '#f8f9fa',
              border: '1px solid #ced4da',
              boxShadow: 'none',

              '&:focus': {
                borderColor: '#4C6EF5',
              },
            },
            error: {
              fontSize: 12,
              margin: 0,
            },
          }}
          sx={{
            marginBottom: '5px',
            marginLeft: '0',
            fontSize: '14px',
            fontWeight: 500,
          }}
          placeholder="Назовите тип..."
          {...register('new-type-input', {
            required:
              newSchemeName.length < 2
                ? 'Название типа не может быть короче 2 символов!'
                : false,
            minLength: {
              value: 2,
              message: 'Название типа не может быть короче 2 символов!',
            },
          })}
          error={
            errors['new-type-input']
              ? errors['new-type-input']?.message?.toString()
              : null
          }
          onChange={(e) => {
            dispatch(setNewSchemeName(e.target.value));
          }}
        />
        <Flex sx={{ justifyContent: 'end' }} mt="20px" gap="16px">
          <Button
            variant="outline"
            sx={{
              border: 'none',
              bg: 'none',
              color: '#A0A0A0',
              fontWeight: 400,
              borderRadius: '8px',
              '&:hover': {
                background: '#EDF2FF',
              },
            }}
            onClick={() => {
              closeModal('addNewType');
              dispatch(setNewSchemeName(''));
            }}
          >
            Отменить
          </Button>
          <Button
            type="submit"
            sx={{
              fontWeight: 400,
              borderRadius: '8px',
            }}
          >
            Создать
          </Button>
        </Flex>
      </form>
    </>
  );
};
