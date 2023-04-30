import {
  Document,
  ShortDocumentFields,
  DocumentFields,
} from 'store/api/document/types';

export interface GenerateDocumentFromOcrFields {
  fields: Record<`${keyof DocumentFields}-${number}`, string>;
  directoryId: number | null;
  schemeId: number;
  original: string | ArrayBuffer | null;
  documentName: string;
  subtype: string;
}

export const generateDocumentFromOcrFields = async ({
  fields,
  directoryId,
  schemeId,
  original,
  documentName,
  subtype,
}: GenerateDocumentFromOcrFields): Promise<
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
      const fieldValue = {
        id: parseInt(id),
        value: value,
        subtype: subtype,
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

  return {
    original_name: documentName,
    original: original,
    scheme: schemeId,
    directory: directoryId,
    fields: finalFields as ShortDocumentFields,
  };
};
