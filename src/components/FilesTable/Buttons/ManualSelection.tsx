import { FC } from 'react';
import { Button } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IconListSearch } from '@tabler/icons';
import { DisableAble } from '.';
import { SelectScheme } from '../Modals/SelectScheme';
import { ManualDropZone } from '../Modals/ManualSelection/ManualDropzone';

export const ManualSelection: FC<DisableAble> = ({ disabled = false }) => {
  return (
    <Button
      styles={() => ({
        root: {
          padding: '6px 22px 6px 20px',
          height: 35,
          fontSize: 16,
          fontWeight: 500,
          borderRadius: 8,
        },

        leftIcon: {
          marginRight: 5,
        },
      })}
      disabled={disabled}
      leftIcon={<IconListSearch size={18} stroke={2} />}
      onClick={() =>
        openModal({
          title: 'Выбрать тип для ручной разметки полей',
          modalId: 'ManualDropzone',
          closeOnEscape: false,
          centered: true,
          children: (
            <SelectScheme
              styles={{
                modal: {
                  width: '880px !important',
                },
              }}
              nextStep={() => <ManualDropZone />}
            />
          ),
        })
      }
    >
      Раcпознавание
    </Button>
  );
};
