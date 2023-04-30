import { Fields, Scheme } from 'store/api/document/types';

export const mergeSchemesFields = (schemes: Scheme[]): Fields => {
  const result: Fields = {
    bool_field_scheme: [],
    enum_field_scheme: [],
    file_field_scheme: [],
    filelist_field_scheme: [],
    int_field_scheme: [],
    link_field_scheme: [],
    linklist_field_scheme: [],
    list_field_scheme: [],
    real_field_scheme: [],
    text_field_scheme: [],
    datetime_field_scheme: [],
    user_field_scheme: [],
    userlist_field_scheme: [],
  };

  // тут происходит склейка всех пришедших схем
  schemes.forEach((scheme) => {
    for (const [key, value] of Object.entries(scheme.fields)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      result[key as keyof Fields]!.push(...value);
    }
  });

  return result as Fields;
};
