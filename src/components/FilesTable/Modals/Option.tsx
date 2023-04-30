/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Group, Box, Text, Button, Flex, Tooltip } from '@mantine/core';
import { ReactComponent as Plus } from '../../../assets/SVG/Plus.svg';
import { ReactComponent as Trash } from '../../../assets/SVG/Trash.svg';
import { ReactComponent as Question } from '../../../assets/SVG/Question.svg';
import { closeAllModals, openConfirmModal, openModal } from '@mantine/modals';
import { AddNewType } from './NewType/AddNewType';
import { useDeleteSchemeMutation } from 'store/api/document';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons';
import { components } from 'react-select';

export const Option = (props: any) => {
  const [deleteScheme, { isLoading }] = useDeleteSchemeMutation();

  return (
    <components.Option {...props}>
      <Group
        sx={{
          height: '50px',
          cursor: 'pointer',
          justifyContent: 'space-between',
        }}
        onClick={() => {
          if (props.data.createNewType) {
            openModal({
              modalId: 'addNewType',
              closeOnEscape: false,
              title: 'Создание типа документа',
              centered: true,
              children: <AddNewType />,
            });
          }
        }}
      >
        <Flex sx={{ gap: '10px', alignItems: 'center', width: '80%' }}>
          {props.data.createNewType && (
            <Box sx={{ marginRight: '-5px', marginTop: '6px' }}>
              <Plus />
            </Box>
          )}
          <Text
            sx={{
              color: 'black',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {props.data.value}
          </Text>
        </Flex>
        {!props.data.createNewType && (
          <Tooltip label="Удалить схему">
            <Button
              variant="outline"
              sx={{
                width: '10%',
                border: 'none',
                padding: '5px',
                '&:hover': {
                  backgroundColor: '#EDF1EE',
                },
              }}
              onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                e.stopPropagation();
                openConfirmModal({
                  title: 'Удаление документов',
                  centered: true,
                  children: (
                    <Flex justify="space-between">
                      <Question />
                      <Text w="90%" sx={{ marginLeft: '5px' }}>
                        Ваши документы по этому типу будут удалены. Вы уверены,
                        что хотите удалить этот тип?
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
                    sx: {
                      fontWeight: 400,
                      borderRadius: '8px',
                    },
                    loading: isLoading,
                  },
                  onConfirm: async () => {
                    await deleteScheme(props.data.id).then(() => {
                      closeAllModals();
                    });
                    showNotification({
                      title: 'Подтверждено',
                      color: 'teal',
                      icon: <IconCheck size={16} />,
                      message: 'Схема успешно удалена!',
                    });
                  },
                });
              }}
            >
              <Trash width="20px" />
            </Button>
          </Tooltip>
        )}
      </Group>
    </components.Option>
  );
};
