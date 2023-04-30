export interface SuperSchemes {
  superFields: Fields;
  schemes: Record<number, Scheme>;
}

export interface OcrRequest {
  scheme_id: number;
  file_type: string;
  document: string | ArrayBuffer | null;
}

export interface OcrResponseField {
  id: number;
  value: string | number | boolean;
}

export interface OcrResponse {
  fields: {
    [id: number]: OcrResponseField;
  };
  mismatch_warning: boolean;
}

export interface Document {
  id: number;
  original: string | ArrayBuffer | null;
  original_name: string;
  scheme: number;
  fields: DocumentFields;
  directory: number;
  createdate: string;
  modifydate: string;
  creator: number;
  deletemark: boolean;
}
export interface DocumentFields {
  int_field?: IntFieldsEntityOrRealFieldEntity[];
  real_field?: IntFieldsEntityOrRealFieldEntity[];
  datetime_field?: DateTimeFieldEntity[];
  text_field?: TimeFieldEntityOrTextFieldEntity[];
  enum_field?: EnumFieldEntity[];
  list_field?: ListFieldEntity[];
  bool_field?: BoolFieldEntity[];
  file_field?: FileFieldEntity[];
  filelist_field?: FilelistFieldEntity[];
  link_field?: LinkFieldEntity[];
  linklist_field?: LinklistFieldEntity[];
  user_field?: UserFieldEntity[];
  userlist_field?: UserlistFieldEntity[];
}
export interface IntFieldsEntityOrRealFieldEntity {
  id: number;
  local_index: number;
  name: string;
  value: number;
}
export interface TimeFieldEntityOrTextFieldEntity {
  id: number;
  local_index: number;
  name: string;
  value: string;
}

export interface DateTimeFieldEntity {
  id: number;
  local_index: number;
  name: string;
  value: string;
  subtype: string;
}
export interface EnumFieldEntity {
  id: number;
  local_index: number;
  name: string;
  choosenvalue: ChoosenvalueOrChoosenvaluesEntity;
}
export interface ChoosenvalueOrChoosenvaluesEntity {
  value: number;
}
export interface ListFieldEntity {
  id: number;
  local_index: number;
  name: string;
  choosenvalues?: ChoosenvalueOrChoosenvaluesEntity[] | null;
}
export interface BoolFieldEntity {
  id: number;
  local_index: number;
  name: string;
  value: boolean;
}
export interface FileFieldEntity {
  id: number;
  local_index: number;
  name: string;
  file: string;
}
export interface FilelistFieldEntity {
  id: number;
  local_index: number;
  name: string;
  file_list?: string[] | null;
}
export interface LinkFieldEntity {
  id: number;
  local_index: number;
  name: string;
  link_choosen: number;
}
export interface LinklistFieldEntity {
  id: number;
  local_index: number;
  name: string;
  links_choosen?: number[] | null;
}
export interface UserFieldEntity {
  id: number;
  local_index: number;
  name: string;
  user_id: number;
}
export interface UserlistFieldEntity {
  id: number;
  local_index: number;
  name: string;
  user_id_choosen?: number[] | null;
}

export interface Scheme extends Record<string, unknown> {
  id: number;
  title: string;
  createdate: string;
  modifydate: string;
  creator: number;
  deletemark: boolean;
  fields: Fields;
  value?: string;
  ocr_available: boolean;
}

export interface Fields {
  int_field_scheme: IntFieldsSchemeEntity[];
  real_field_scheme: RealFieldSchemeEntity[];
  datetime_field_scheme: DateTimeFieldSchemeEntity[];
  text_field_scheme: TextFieldSchemeEntity[];
  enum_field_scheme: EnumFieldSchemeEntity[];
  list_field_scheme: ListFieldSchemeEntity[];
  bool_field_scheme:
    | BoolFieldSchemeEntityOrFileFieldSchemeEntityOrLinkFieldSchemeEntityOrUserFieldSchemeEntity[];
  file_field_scheme:
    | BoolFieldSchemeEntityOrFileFieldSchemeEntityOrLinkFieldSchemeEntityOrUserFieldSchemeEntity[];
  filelist_field_scheme: FilelistFieldSchemeEntity[];
  link_field_scheme:
    | BoolFieldSchemeEntityOrFileFieldSchemeEntityOrLinkFieldSchemeEntityOrUserFieldSchemeEntity[];
  linklist_field_scheme: LinklistFieldSchemeEntity[];
  user_field_scheme:
    | BoolFieldSchemeEntityOrFileFieldSchemeEntityOrLinkFieldSchemeEntityOrUserFieldSchemeEntity[];
  userlist_field_scheme: UserlistFieldSchemeEntity[];
}
export interface FieldsTypes {
  name: string;
  max_val: number;
  min_val: number;
  fieldType: string;
  digits_after_point: number;
  max_length: number;
  id: number;
  value: string | number | boolean | null;
  local_index: number;
  required: boolean;
  lettercase: string;
  page: number;
  subtype: 'datetime' | 'date' | 'time';
}
export interface IntFieldsSchemeEntity {
  id: number;
  local_index: number;
  name: string;
  required: boolean;
  min_val: number;
  max_val: number;
}
export interface RealFieldSchemeEntity {
  id: number;
  local_index: number;
  name: string;
  required: boolean;
  min_val: number;
  max_val: number;
  digits_after_point: number;
}

export interface DateFieldSchemeEntity {
  id: number;
  local_index: number;
  name: string;
  required: boolean;
  with_time: boolean;
}

export interface DateTimeFieldSchemeEntity {
  id: number;
  local_index: number;
  name: string;
  required: boolean;
  subtype: string;
}

export type TextProcessingMode =
  | 'upper'
  | 'onlyfirstupper'
  | 'firstupper'
  | 'noformat';

export interface TextFieldSchemeEntity {
  id: number;
  local_index: number;
  name: string;
  max_length: number;
  required: boolean;
  lettercase: TextProcessingMode;
}
export interface EnumFieldSchemeEntity {
  id: number;
  local_index: number;
  name: string;
  required: boolean;
  allvalue: AllvalueOrAllvaluesEntity;
}
export interface AllvalueOrAllvaluesEntity {
  value: number;
}
export interface ListFieldSchemeEntity {
  id: number;
  local_index: number;
  name: string;
  required: boolean;
  allvalues?: AllvalueOrAllvaluesEntity[] | null;
}
export interface BoolFieldSchemeEntityOrFileFieldSchemeEntityOrLinkFieldSchemeEntityOrUserFieldSchemeEntity {
  id: number;
  local_index: number;
  name: string;
  required: boolean;
}
export interface FilelistFieldSchemeEntity {
  id: number;
  local_index: number;
  name: string;
  required: boolean;
  min: number;
  max: number;
}
export interface LinklistFieldSchemeEntity {
  id: number;
  local_index: number;
  name: string;
  required: boolean;
  links_all?: number[] | null;
}
export interface UserlistFieldSchemeEntity {
  id: number;
  local_index: number;
  name: string;
  user_id_all?: number[] | null;
  required: boolean;
}

export interface SchemeId {
  schemeid: number;
}

export interface SchemeOptions {
  id: number;
  fields: Fields;
  label: string;
  value: string;
  createNewType?: boolean;
}

export interface OcrSchemeOptions {
  id: number;
  fields: Fields;
  label: string;
  value: string;
  ocr_available: boolean;
}

export interface ShortDocumentFields {
  int_field?: ShortIntFieldEntityOrRealFieldEntity[];
  real_field?: ShortIntFieldEntityOrRealFieldEntity[];
  datetime_field?: ShortDateTimeFieldEntity[];
  text_field?: ShortTimeFieldEntityOrDateFieldEntityOrTextFieldEntity[];
  enum_field?: ShortEnumFieldEntity[];
  list_field?: ShortListFieldEntity[];
  bool_field?: ShortBoolFieldEntity[];
  file_field?: ShortFileFieldEntity[];
  filelist_field?: ShortFilelistFieldEntity[];
  link_field?: ShortLinkFieldEntity[];
  linklist_field?: ShortLinklistFieldEntity[];
  user_field?: ShortUserFieldEntity[];
  userlist_field?: ShortUserlistFieldEntity[];
}
export interface ShortIntFieldEntityOrRealFieldEntity {
  id: number;
  value: number;
}
export interface ShortTimeFieldEntityOrDateFieldEntityOrTextFieldEntity {
  id: number;
  value: string;
}

export interface ShortDateTimeFieldEntity {
  id: number;
  subtype: string;
  value: string;
}
export interface ShortEnumFieldEntity {
  id: number;
  choosenvalue: ChoosenvalueOrChoosenvaluesEntity;
}
export interface ChoosenvalueOrChoosenvaluesEntity {
  value: number;
}
export interface ShortListFieldEntity {
  name: string;
  choosenvalues?: ChoosenvalueOrChoosenvaluesEntity[] | null;
}
export interface ShortBoolFieldEntity {
  id: number;
  value: boolean;
}
export interface ShortFileFieldEntity {
  id: number;
  file: string;
}
export interface ShortFilelistFieldEntity {
  id: number;
  file_list?: string[] | null;
}
export interface ShortLinkFieldEntity {
  id: number;
  link_choosen: number;
}
export interface ShortLinklistFieldEntity {
  id: number;
  links_choosen?: number[] | null;
}
export interface ShortUserFieldEntity {
  id: number;
  user_id: number;
}
export interface ShortUserlistFieldEntity {
  id: number;
  user_id_choosen?: number[] | null;
}

export interface CreateDocumentResponse {
  id: number;
  original: string;
  scheme: number;
  directory: number;
  createdate: string;
  modifydate: string;
  creator: number;
  deletemark: true;
}
