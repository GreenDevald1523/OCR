import { useState, FC, useMemo } from 'react';
import {
  Text,
  Image,
  SimpleGrid,
  Box,
  Flex,
  Title,
  Button,
} from '@mantine/core';
import { Dropzone, MIME_TYPES, FileWithPath } from '@mantine/dropzone';
import { closeModal } from '@mantine/modals';
import { useOCR } from '../../../../hooks/useOCR';
import { useTypedDispatch, useTypedSelector } from 'store/ReduxHooks';
import {
  selectCurrentTypeName,
  setCurrentTypeName,
} from 'store/slices/currentType';
import { useDropzonePreviews } from 'hooks/useDropzonePreviews';

export const SmartImportDropZone: FC = () => {
  const dispatch = useTypedDispatch();
  const chosenTypeName = useTypedSelector(selectCurrentTypeName);

  const { files, setFiles, previewUrls } = useDropzonePreviews();

  const previews = previewUrls.map((url, index) => {
    return <Image key={index} src={url} />;
  });

  const { handleOcr, isSuccess } = useOCR();

  return (
    <Box>
      <Flex
        pos="relative"
        sx={{
          bottom: '45px',
          maxWidth: '95%',
        }}
      >
        <Title
          order={3}
          sx={{
            fontWeight: 500,
          }}
          maw="100%"
        >
          Умный импорт ({chosenTypeName})
        </Title>
      </Flex>
      <Dropzone
        styles={(theme) => ({
          root: {
            borderColor: theme.colors.indigo[5],
          },
        })}
        h="60vh"
        accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.pdf]}
        onDrop={setFiles}
        multiple={true}
      >
        <Text fw={500} align="center">
          Перетащите свои документы сюда
        </Text>
      </Dropzone>

      <SimpleGrid
        cols={4}
        breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
        mt={previews.length > 0 ? 'xl' : 0}
      >
        {previews}
      </SimpleGrid>
      <Flex sx={{ justifyContent: 'end' }} mt="20px" gap="16px">
        <Button
          variant="outline"
          sx={{
            border: 'none',
            bg: 'none',
            color: '#A0A0A0',
            fontWeight: 400,
            borderRadius: '8px',
          }}
          onClick={() => {
            closeModal('selectOcrScheme');
            dispatch(setCurrentTypeName(''));
          }}
        >
          Отменить
        </Button>
        <Button
          loading={isSuccess}
          onClick={() => handleOcr(previewUrls, files)}
          sx={{
            fontWeight: 400,
            borderRadius: '8px',
          }}
        >
          Сканировать
        </Button>
      </Flex>
    </Box>
  );
};
