import { Flex, Image, Modal } from '@mantine/core';
import { FC } from 'react';

interface DocumentRawPreviewProps {
  onClose: () => void;
  opened: boolean;
  src: string;
  isPdf: boolean;
}

export const DocumentRawPreview: FC<DocumentRawPreviewProps> = ({
  src,
  onClose,
  opened,
  isPdf,
}) => {
  return (
    <Modal
      styles={{
        modal: {
          backgroundColor: 'rgba(0, 0, 0, 0)',
          width: '100vw',
          height: '100vh',
          boxShadow: 'none',
        },
        inner: {
          padding: 0,
        },
        close: {
          width: 30,
          height: 30,
          borderRadius: '100%',
          background: 'black',
          position: 'absolute',
          zIndex: 15,
          right: '2rem',
          top: '3rem',
          color: 'white',
          '&:hover': {
            background: 'white',
            color: 'black',
          },
        },
      }}
      overlayOpacity={0.55}
      overlayBlur={3}
      opened={opened}
      onClose={onClose}
    >
      <Flex h="90vh" w="100%" align="center" justify="center">
        {isPdf ? (
          <iframe
            style={{ border: 'none', height: '100%', width: '100%' }}
            src={src}
          >
            Здесь должен был быть pdf, но пока что он просто качается на комп
          </iframe>
        ) : (
          <Image height="90vh" width="100%" fit="contain" src={src} />
        )}
      </Flex>
    </Modal>
  );
};
