import {
  NewSchemeField,
  SupportedFieldTypes,
} from 'store/slices/newSchemeSlice/types';
import { Fields } from 'store/api/document/types';

export const createSchemeFromAddSchemeForm = (
  name: string,
  fields: NewSchemeField<SupportedFieldTypes>[]
) => {
  const result: Fields = {
    int_field_scheme: [],
    real_field_scheme: [],
    text_field_scheme: [],
    bool_field_scheme: [],
    enum_field_scheme: [],
    file_field_scheme: [],
    filelist_field_scheme: [],
    link_field_scheme: [],
    linklist_field_scheme: [],
    list_field_scheme: [],
    user_field_scheme: [],
    userlist_field_scheme: [],
    datetime_field_scheme: [],
  };

  fields.forEach((field, index) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result[`${field.type}_field_scheme`].push({
      name: field.name,
      required: field.required,
      ...field.params,
      local_index: index,
    });
  });

  return { title: name, fields: result };
};
