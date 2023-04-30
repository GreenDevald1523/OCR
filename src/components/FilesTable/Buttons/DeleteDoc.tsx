import { FC } from 'react';
import { Button, Flex, Text } from '@mantine/core';
import { closeAllModals, openConfirmModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { IconTrash } from '@tabler/icons';
import { ReactComponent as Question } from '../../../assets/SVG/Question.svg';
import { useDeleteDocumentMutation } from 'store/api/document';
import { BasicCustomButtonProps } from '.';

export const DeleteDoc: FC<BasicCustomButtonProps> = ({
  selectedId,
  disabled = false,
}) => {
  const [deleteDocument] = useDeleteDocumentMutation();

  return (
    <Button
      styles={() => ({
        root: {
          padding: '6px 22px 6px 20px',
          height: 35,
          fontSize: 16,
          fontWeight: 500,
          borderRadius: 8,
          color: '#1e1e1e',
        },

        leftIcon: {
          marginRight: 5,
        },
      })}
      leftIcon={<IconTrash size={18} color={'#1E1E1E'} />}
      variant="subtle"
      disabled={!selectedId || disabled}
      onClick={() => {
        if (selectedId === 0) {
          showNotification({
            title: 'Предупреждение',
            message: 'Вы не выбрали ни одного поля для удаления!',
            color: 'red',
          });
        } else {
          openConfirmModal({
            title: 'Подтверждение удаления',
            centered: true,
            children: (
              <Flex>
                <Question />
                <Text sx={{ marginLeft: '5px' }}>
                  Вы уверены, что хотите удалить документ?
                </Text>
              </Flex>
            ),
            labels: { confirm: 'Удалить', cancel: 'Отменить' },
            cancelProps: {
              sx: {
                border: 'none',
                bg: 'none',
                color: '#A0A0A0',
                fontWeight: 400,
                borderRadius: '8px',
                '&:hover': {
                  background: '#EDF2FF',
                },
              },
            },
            confirmProps: {
              styles: (theme) => ({
                root: {
                  fontWeight: 400,
                  borderRadius: '8px',
                  backgroundColor: theme.colors.red[6],

                  ['&:hover']: {
                    backgroundColor: theme.colors.red[7],
                  },
                },
              }),
            },
            onConfirm: () => {
              if (selectedId)
                deleteDocument(selectedId)
                  .unwrap()
                  .then(() => closeAllModals());
              else closeAllModals();
            },
          });
        }
      }}
    >
      Удалить
    </Button>
  );
};
