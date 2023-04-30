import { DocumentFields, ShortDocumentFields } from 'store/api/document/types';

export const createShortFieldsFromFields = (fields: DocumentFields) => {
  const result: ShortDocumentFields = {
    bool_field: [],
    datetime_field: [],
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
  };

  for (const [key, value] of Object.entries(fields)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result[key as keyof ShortDocumentFields] = (
      value as DocumentFields[keyof DocumentFields]
    )?.map(({ local_index: _, name: __, ...field }) => ({
      ...field,
    }));
  }

  return result;
};
