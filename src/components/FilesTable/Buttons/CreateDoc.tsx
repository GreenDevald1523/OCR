import { Button } from '@mantine/core';
import { FC } from 'react';
import { IconPlus } from '@tabler/icons';
import { openModal } from '@mantine/modals';
import { SelectScheme } from '../Modals/SelectScheme';
import { DisableAble } from '.';

export const CreateDoc: FC<DisableAble> = ({ disabled = false }) => {
  return (
    <>
      <Button
        styles={() => ({
          root: {
            padding: '6px 12px',
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
        disabled={disabled}
        leftIcon={<IconPlus size={16} color={'#1E1E1E'} />}
        variant="subtle"
        onClick={() => {
          openModal({
            styles: {
              title: {
                fontWeight: 500,
              },
            },
            modalId: 'createType',
            closeOnEscape: false,
            title: 'Создание документа',
            centered: true,
            children: <SelectScheme />,
          });
        }}
      >
        Создать
      </Button>
    </>
  );
};
