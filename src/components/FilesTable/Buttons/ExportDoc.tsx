import { FC } from 'react';
import { Button, Radio, Text } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { IconFileExport } from '@tabler/icons';
import { BasicCustomButtonProps } from '.';

export const ExportDoc: FC<BasicCustomButtonProps> = ({
  selectedId,
  disabled = false,
}) => {
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
      disabled={!selectedId || disabled}
      leftIcon={<IconFileExport size={18} color={'#1E1E1E'} />}
      variant="subtle"
      onClick={() => {
        if (!selectedId) {
          showNotification({
            title: 'Предупреждение',
            message: 'Вы не выбрали ни одного поля для экспорта!',
            color: 'red',
          });
        } else {
          openConfirmModal({
            title: 'Экспорт документов',
            centered: true,
            children: (
              <>
                <Text sx={{ marginLeft: '5px' }}>
                  Выберете любой доступный вариант экспортирования
                </Text>
                <Radio.Group orientation="vertical" spacing="xs">
                  <Radio
                    value="1"
                    label=".docs"
                    // icon={<Affirmative />}
                  />
                  <Radio
                    value="2"
                    label=".pdf"
                    // icon={
                    //   <ThemeIcon>
                    //     <Affirmative />
                    //   </ThemeIcon>
                    // }
                  />
                  <Radio
                    value="3"
                    label=".jpg"
                    // icon={<Affirmative />}>
                  />
                  <Radio
                    value="4"
                    label=".png"
                    // icon={<Affirmative />}>
                  />
                </Radio.Group>
              </>
            ),
            labels: { confirm: 'Экспорт', cancel: 'Отменить' },
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
            },
          });
        }
      }}
    >
      Экспорт
    </Button>
  );
};
