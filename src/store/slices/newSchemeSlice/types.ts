/* eslint-disable @typescript-eslint/no-empty-interface */
export type SupportedFieldTypes = 'int' | 'real' | 'text' | 'bool' | 'datetime';
export interface NewSchemeField<T extends SupportedFieldTypes> {
  name: string;
  type: T;
  required: boolean;
  params: FieldsMapping[T];
}
export interface FieldsMapping {
  int: NumericFieldParams;
  real: RealFieldParams;
  text: TextFieldParams;
  bool: TextFieldParams;
  datetime: DateTimeParams;
}

export const TypesMap = {
  int: 'Целое число',
  real: 'Действительное число',
  bool: 'Отметка',
  text: 'Строка',
  datetime: 'Дата/время',
} as const;
interface NumericFieldParams {
  min_val: number;
  max_val: number;
}

interface DateTimeParams {
  subtype: string;
}

interface RealFieldParams {
  digits_after_point: number;
}

export type LetterCaseVariants =
  | 'upper'
  | 'firstupper'
  | 'onlyfirstupper'
  | 'noformat';

interface TextFieldParams {
  max_length: number;
  lettercase: LetterCaseVariants;
}

interface BoolFieldParams {}

type RequiredField = { required: boolean };

type NewIntFormParams = NumericFieldParams & RequiredField;
type NewRealFormParams = NewIntFormParams & RealFieldParams;
type NewTextFormParams = TextFieldParams & RequiredField;
type NewBoolFormParams = BoolFieldParams & RequiredField;
type DateTimeFormParams = DateTimeParams & RequiredField;

export type FieldsParams =
  | NewIntFormParams
  | NewRealFormParams
  | NewBoolFormParams
  | NewTextFormParams
  | DateTimeFormParams;
