import { useState, FC, useMemo, useEffect } from 'react';

import {
  Text,
  Image,
  SimpleGrid,
  Box,
  Flex,
  Title,
  Button,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { closeModal, openModal } from '@mantine/modals';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';

import { ManualSelectionForm } from './ManualSelectionForm';

import { useModalTypesAndFields } from 'hooks/useModalSchemesAndFields';
import { fileToBase64 } from 'utils/fileToBase64';

import { useTypedDispatch, useTypedSelector } from 'store/ReduxHooks';
import {
  selectCurrentTypeName,
  setCurrentTypeName,
} from 'store/slices/currentType';
import { useDropzonePreviews } from 'hooks/useDropzonePreviews';

export const ManualDropZone: FC = () => {
  const matches = useMediaQuery('(min-width: 2000px)');

  const dispatch = useTypedDispatch();
  const chosenTypeName = useTypedSelector(selectCurrentTypeName);
  const { schemesAll } = useModalTypesAndFields();

  const schemeId = useMemo(
    () =>
      (
        schemesAll.find((scheme) => {
          return scheme.label === chosenTypeName && scheme;
        }) || { id: 0 }
      ).id,
    [schemesAll, chosenTypeName]
  );

  const { files, setFiles, previewUrls } = useDropzonePreviews();

  const previews = previewUrls.map((url, index) => {
    return <Image key={index} src={url} />;
  });

  const [documentsData, setDocumentsData] = useState<
    {
      original: string;
      documentName: string;
    }[]
  >([]);

  useEffect(() => {
    const formDocumentsData = async () => {
      const documentsEffectData = await Promise.all(
        files.map(async (file) => {
          return {
            original: await fileToBase64(file),
            documentName: file.name,
          };
        })
      );
      setDocumentsData(documentsEffectData);
    };

    formDocumentsData();
  }, [files]);

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
          Ручное распознавание ({chosenTypeName})
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
            closeModal('ManualDropzone');
            dispatch(setCurrentTypeName(''));
          }}
        >
          Отменить
        </Button>
        <Button
          onClick={() => {
            openModal({
              modalId: 'manualSelectionForm',
              centered: true,
              styles: {
                modal: {
                  width: '35vw',
                  position: 'relative',
                },
                inner: {
                  overflowX: 'hidden',
                  justifyContent: 'flex-start',
                  left: '8vw',
                  width: '100%',
                  padding: 0,
                },
              },
              closeOnEscape: false,
              children: (
                <ManualSelectionForm
                  schemeId={schemeId}
                  previewsUrls={previewUrls}
                  documentsData={documentsData}
                />
              ),
            });
          }}
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
