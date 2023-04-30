import { FC } from 'react';
import { Button } from '@mantine/core';
import { IconFile } from '@tabler/icons';
import { Document } from 'store/api/document/types';
import { DocumentPreview } from '../Modals/DocumentPreview/DocumentPreview';
import { openModal } from '@mantine/modals';
import { BasicCustomButtonProps } from '.';

interface OpenDocButtonProps extends BasicCustomButtonProps {
  currentDocument: Document | undefined;
}

export const OpenDoc: FC<OpenDocButtonProps> = ({
  currentDocument,
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
      leftIcon={<IconFile size={18} color={'#1E1E1E'} />}
      disabled={!selectedId || disabled}
      variant="subtle"
      onClick={() => {
        if (selectedId && currentDocument)
          openModal({
            centered: true,
            closeOnEscape: false,
            title: currentDocument.original_name.split('.')[0],
            children: <DocumentPreview document={currentDocument} />,
            styles: { modal: { width: '666px !important' } },
          });
      }}
    >
      Открыть
    </Button>
  );
};
