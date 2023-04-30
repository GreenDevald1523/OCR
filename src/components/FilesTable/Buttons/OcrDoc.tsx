import { FC } from 'react';
import { Button } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IconFileImport } from '@tabler/icons';
import { SelectOcrScheme } from '../Modals/SmartImport/SelectOcrScheme';
import { DisableAble } from '.';

export const OcrDoc: FC<DisableAble> = ({ disabled = false }) => {
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
      leftIcon={<IconFileImport size={18} />}
      onClick={() =>
        openModal({
          title: 'Выбрать тип с поддежкой OCR',
          closeOnEscape: false,
          centered: true,
          children: <SelectOcrScheme />,
        })
      }
    >
      Умный импорт
    </Button>
  );
};
