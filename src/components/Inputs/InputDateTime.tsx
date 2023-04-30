import {
  Control,
  FieldErrorsImpl,
  FieldValues,
  UseFormRegister,
} from 'react-hook-form';
import { DatePicker, TimeInput } from '@mantine/dates';
import { Actions } from 'hooks/useMap';
import { Controller } from 'react-hook-form';
import { Flex } from '@mantine/core';
import { FieldsTypes } from 'store/api/document/types';
import { useTypedDispatch, useTypedSelector } from 'store/ReduxHooks';
import { selectDateTimeValues, setDateTime } from 'store/slices/dateTime';

interface InputDateTimeProps {
  page?: number;
  register: UseFormRegister<FieldValues>;
  fieldInfo: Omit<
    FieldsTypes,
    | 'page'
    | 'max_val'
    | 'min_val'
    | 'fieldType'
    | 'digits_after_point'
    | 'max_length'
    | 'required'
    | 'lettercase'
  > &
    Partial<
      Pick<
        FieldsTypes,
        | 'page'
        | 'max_val'
        | 'min_val'
        | 'fieldType'
        | 'digits_after_point'
        | 'max_length'
        | 'required'
        | 'lettercase'
      >
    >;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<FieldValues, any>;
  cropBoxMap?: Omit<
    Map<string, Cropper.CropBoxData>,
    'delete' | 'set' | 'clear'
  >;
  focusedField?: string | null;
  actions?: Actions<string, Cropper.CropBoxData>;
  setFocusedField?: (value: React.SetStateAction<string | null>) => void;
  cropper?: Cropper;
  isRecognition: boolean;
}

export default function InputDateTime({
  register,
  fieldInfo,
  control,
  cropBoxMap,
  focusedField,
  actions,
  setFocusedField,
  cropper,
  page,
  isRecognition,
}: InputDateTimeProps) {
  const dispatch = useTypedDispatch();

  const dateTimeValues = useTypedSelector(selectDateTimeValues);
  const focusFieldHandler = (fieldId: string) => {
    if (!cropper || !cropBoxMap || !actions || !setFocusedField) return;
    const nextCropBoxData = cropBoxMap.get(fieldId);
    // if (focusedField) actions.set(focusedField, cropper.getCropBoxData());

    if (nextCropBoxData) {
      if (focusedField) {
        actions.set(focusedField, cropper.getCropBoxData());
        cropper.setCropBoxData(nextCropBoxData);
        setFocusedField(fieldId);
      } else {
        setFocusedField(fieldId);
        return;
      }
    } else {
      if (focusedField) {
        actions.set(focusedField, cropper.getCropBoxData());
        cropper.clear();
        setFocusedField(fieldId);
      } else {
        setFocusedField(fieldId);
        return;
      }
    }
    // setFocusedField(fieldId);
    // ;
  };

  return (
    <Flex direction="row" justify="space-between" gap={30}>
      {fieldInfo.subtype !== 'time' && (
        <Controller
          control={control}
          render={({
            field: { onChange, value = (fieldInfo.value || '') as string },
          }) => {
            return (
              <DatePicker
                dropdownType={isRecognition ? 'popover' : 'modal'}
                locale="ru"
                labelFormat="MM/YYYY"
                inputFormat="DD/MM/YYYY"
                clearable={false}
                value={
                  !value
                    ? dateTimeValues[
                        `datetime_field-${page ? page : ''}${fieldInfo.id}-${
                          fieldInfo.subtype
                        }`
                      ]
                    : new Date(value)
                }
                sx={{ flex: 1 }}
                onChange={(e) => {
                  const key = value
                    ? e?.toISOString().split('T')[0] +
                      'T' +
                      new Date(value).toISOString().split('T')[1]
                    : e;
                  dispatch(
                    setDateTime({
                      [`datetime_field-${page ? page : ''}${fieldInfo.id}-${
                        fieldInfo.subtype
                      }`]: new Date(key || ''),
                    })
                  );
                  onChange(
                    value
                      ? e?.toISOString().split('T')[0] +
                          'T' +
                          new Date(value).toISOString().split('T')[1]
                      : value
                  );
                }}
                onFocus={() =>
                  focusFieldHandler(
                    `datetime_field-${page ? page : ''}${fieldInfo.id}-${
                      fieldInfo.subtype
                    }`
                  )
                }
              />
            );
          }}
          {...register(
            `datetime_field-${page ? page : ''}${fieldInfo.id}-${
              fieldInfo.subtype
            }`,
            {
              required: fieldInfo.required
                ? 'Поле обязательно к заполнению'
                : false,
            }
          )}
        />
      )}
      {fieldInfo.subtype !== 'date' && (
        <Controller
          control={control}
          render={({
            field: { onChange, value = (fieldInfo.value || '') as string },
          }) => (
            <TimeInput
              sx={{ flex: 1 }}
              withSeconds
              value={
                !value
                  ? dateTimeValues[
                      `datetime_field-${page ? page : ''}${fieldInfo.id}-${
                        fieldInfo.subtype
                      }`
                    ]
                  : new Date(value)
              }
              onChange={(e) => {
                const key =
                  new Date(value).toISOString().split('T')[0] +
                  'T' +
                  e?.toISOString().split('T')[1];
                dispatch(
                  setDateTime({
                    [`datetime_field-${page ? page : ''}${fieldInfo.id}-${
                      fieldInfo.subtype
                    }`]: new Date(key),
                  })
                );
                onChange(
                  e?.toISOString().split('T')[0] +
                    'T' +
                    new Date(value).toISOString().split('T')[1]
                );
              }}
              onFocus={() =>
                focusFieldHandler(
                  `datetime_field-${page ? page : ''}${fieldInfo.id}-${
                    fieldInfo.subtype
                  }`
                )
              }
            />
          )}
          {...register(
            `datetime_field-${page ? page : ''}${fieldInfo.id}-${
              fieldInfo.subtype
            }`,
            {
              required: fieldInfo.required
                ? 'Поле обязательно к заполнению'
                : false,
            }
          )}
        />
      )}
    </Flex>
  );
}
