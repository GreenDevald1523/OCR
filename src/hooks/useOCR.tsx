/* eslint-disable @typescript-eslint/naming-convention */
import { FileWithPath } from '@mantine/dropzone';
import { openModal } from '@mantine/modals';
import { OcrFields } from '../components/FilesTable/Modals/SmartImport/OcrFields';
import { useSendOcrDataMutation } from 'store/api/document';
import { useTypedSelector } from 'store/ReduxHooks';
import { selectCurrentTypeName } from 'store/slices/currentType';
import { useModalTypesAndFields } from './useModalSchemesAndFields';
import { fileToBase64 } from '../utils/fileToBase64';

export const useOCR = () => {
  const chosenTypeName = useTypedSelector(selectCurrentTypeName);

  const { schemesOcr } = useModalTypesAndFields();

  const [ocr, { isLoading }] = useSendOcrDataMutation();

  const handleOcr = async (previewUrls: string[], files: FileWithPath[]) => {
    const documentsData = [];
    const schemes = schemesOcr.find((scheme) => {
      return scheme.label === chosenTypeName && scheme;
    }) || { id: 0 };
    const scheme_id = schemes.id;
    for (const file of files) {
      const file_type = file.type.slice(
        file.type.indexOf('/') + 1,
        file.type.length
      );
      const document = await fileToBase64(file);
      const payload = await ocr({
        scheme_id,
        file_type,
        document,
      }).unwrap();
      documentsData.push({
        original: document,
        payload: payload,
        documentName: file.name,
      });
    }
    openModal({
      modalId: 'ocrData',
      closeOnEscape: false,
      centered: true,
      styles: {
        modal: {
          width: '35vw',
          position: 'relative',
        },
        inner: {
          overflowX: 'hidden',
          justifyContent: 'flex-start',
          left: '7vw',
          width: '100%',
        },
      },
      children: (
        <OcrFields
          previewsUrls={previewUrls}
          schemeId={scheme_id}
          documentsData={documentsData}
        />
      ),
    });
  };
  return { handleOcr, isSuccess: isLoading };
};
