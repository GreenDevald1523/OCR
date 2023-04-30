import {
  Document,
  ShortDocumentFields,
  DocumentFields,
} from 'store/api/document/types';
import { fileToBase64 } from './fileToBase64';

export interface GenerateDocumentFromAddDocumentFormArgs {
  fields: Record<`${keyof DocumentFields}-${number}`, string>;
  directoryId: number | null;
  schemeId: number;
  scanFile: File;
}

export const generateDocumentFromAddDocumentForm = async ({
  fields,
  directoryId,
  schemeId,
  scanFile,
}: GenerateDocumentFromAddDocumentFormArgs): Promise<
  Pick<Document, 'scheme' | 'original'> & {
    fields: ShortDocumentFields;
    original_name: string;
    directory: number | null;
  }
> => {
  const finalFields: ShortDocumentFields = {
    bool_field: [],
    enum_field: [],
    file_field: [],
    filelist_field: [],
    int_field: [],
    link_field: [],
    linklist_field: [],
    list_field: [],
    real_field: [],
    text_field: [],
    user_field: [],
    userlist_field: [],
    datetime_field: [],
  };

  for (const [key, value] of Object.entries(fields)) {
    const [type, id] = key.split('-');
    const numeric = type === 'int_field' || type === 'real_field';

    if (type === 'datetime_field') {
      // Получаем буквенное выражение из конца строки, типо "-date" "-datetime" и т.д.
      const regexForSubtype = /-(\w+)$/g;

      const subtype = key.match(regexForSubtype)?.[0].substring(1);

      const fieldValue = {
        id: parseInt(id),
        value: value,
        subtype,
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      finalFields[type as keyof ShortDocumentFields]?.push(fieldValue);
    } else {
      const fieldValue = {
        id: parseInt(id),
        value: numeric ? (parseInt(value) ? parseInt(value) : 0) : value,
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      finalFields[type as keyof ShortDocumentFields]?.push(fieldValue);
    }
  }

  const base64File = await fileToBase64(scanFile);

  return {
    directory: directoryId,
    fields: finalFields as ShortDocumentFields,
    scheme: schemeId,
    original: base64File
      ? base64File.toString()
      : 'broken base64 from frontend',
    original_name: scanFile.name,
  };
};
