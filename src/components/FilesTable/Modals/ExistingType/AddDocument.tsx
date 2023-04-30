/* eslint-disable import/no-extraneous-dependencies */
import {
  Input,
  Text,
  Box,
  Flex,
  Title,
  TextInput,
  Button,
  Group,
  Checkbox,
  ScrollArea,
  FileButton,
} from '@mantine/core';
import { useTypedDispatch, useTypedSelector } from 'store/ReduxHooks';
import {
  selectCurrentTypeId,
  selectCurrentTypeName,
  setCurrentTypeName,
} from 'store/slices/currentType';
import { useModalTypesAndFields } from '../../../../hooks/useModalSchemesAndFields';
import { useMemo, useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { generateDocumentFromAddDocumentForm } from '../../../../utils/generateDocumentFromAddDocumentForm';
import { closeAllModals, closeModal } from '@mantine/modals';
import { useCreateDocumentMutation } from 'store/api/document';
import { showNotification } from '@mantine/notifications';
import { Fields, TextProcessingMode } from 'store/api/document/types';
import { textInputHandler } from '../../../../utils/textInputHandler';
import { selectCurrentDirectoryId } from 'store/slices/currentDirectory';
import InputDateTime from 'components/Inputs/InputDateTime';
import {
  clearAll,
  selectDateTimeValues,
  setDateTime,
} from 'store/slices/dateTime';
import { DatePicker, TimeInput } from '@mantine/dates';

export const AddDocument = () => {
  const dispatch = useTypedDispatch();
  const chosenTypeName = useTypedSelector(selectCurrentTypeName);
  const chosenTypeId = useTypedSelector(selectCurrentTypeId);
  const currentDirectoryId = useTypedSelector(selectCurrentDirectoryId);

  const { schemesAll } = useModalTypesAndFields();

  const [file, setFile] = useState<File | null>(null);

  const [sendDocument, { isLoading }] = useCreateDocumentMutation();

  useEffect(() => {
    dispatch(clearAll());
    return () => {
      dispatch(clearAll());
    };
  }, [dispatch]);

  const {
    register,
    formState: { errors },
    getValues,
    setValue,
    control,
  } = useForm({
    mode: 'onChange',
  });

  const fields = useMemo(() => {
    if (schemesAll) {
      return (
        schemesAll.find((scheme) => scheme.id === chosenTypeId) || {
          fields: {} as Fields,
        }
      ).fields;
    }
    return {} as Fields;
  }, [schemesAll, chosenTypeId]);

  const FieldsData: {
    name: string;
    value: string;
    subtype: 'date' | 'time' | 'datetime';
    max_val: number;
    min_val: number;
    fieldType: string;
    digits_after_point: number;
    max_length: number;
    id: number;
    local_index: number;
    required: boolean;
    lettercase: string;
  }[] = [];

  for (const [key, value] of Object.entries(fields)) {
    if (value.length !== 0) {
      (value as any[]).forEach((field) => {
        FieldsData.push({
          fieldType: key,
          id: field.id,
          value: '',
          subtype: field.subtype,
          name: field.name,
          local_index: field.local_index,
          min_val: field.min_val,
          max_val: field.max_val,
          digits_after_point: field.digits_after_point,
          max_length: field.max_length,
          required: field.required,
          lettercase: field.lettercase,
        });
      });
    }
  }

  FieldsData.sort((a, b) =>
    a.local_index > b.local_index ? 1 : a.local_index < b.local_index ? -1 : 0
  );

  const dateTimeValues = useTypedSelector(selectDateTimeValues);

  const FieldsForm = FieldsData.map((children) => (
    <Flex key={children.id} my={15} align="center">
      <Text w="20%" lineClamp={2}>
        {children.name}
      </Text>

      {(() => {
        switch (children.fieldType) {
          case 'bool_field_scheme':
            return (
              <Checkbox
                label={children.name}
                {...register(
                  `${children.fieldType.replace('_scheme', '')}-${children.id}`
                )}
                h={20}
              />
            );
          case 'text_field_scheme':
            return (
              <TextInput
                sx={() => ({
                  flex: 2,
                })}
                {...register(
                  `${children.fieldType.replace('_scheme', '')}-${children.id}`,
                  {
                    required: children.required
                      ? 'Поле обязательно к заполнению'
                      : false,

                    setValueAs: (val) =>
                      textInputHandler(
                        val,
                        children.lettercase as TextProcessingMode
                      ),
                    maxLength: {
                      value: children.max_length,
                      message: `Значение должно быть не больше ${children.max_length} символов в длину `,
                    },
                  }
                )}
                error={
                  errors[
                    `${children.fieldType.replace('_scheme', '')}-${
                      children.id
                    }`
                  ]
                    ? errors[
                        `${children.fieldType.replace('_scheme', '')}-${
                          children.id
                        }`
                      ]?.message?.toString()
                    : null
                }
              />
            );
          case 'int_field_scheme':
            return (
              <TextInput
                sx={() => ({
                  flex: 2,
                })}
                {...register(
                  `${children.fieldType.replace('_scheme', '')}-${children.id}`,
                  {
                    required: children.required
                      ? 'Поле обязательно к заполнению'
                      : false,
                    setValueAs: (val) => {
                      const replacedValue =
                        typeof val === 'string' ? val.replace(',', '.') : val;

                      // Пришлось дополнительно валидировать тут потому что я криворукое мудило и не смог заставить
                      // эту регулярку работать в свойстве pattern
                      if (
                        !replacedValue
                          .toString()
                          .match(new RegExp(`^[+|-]?\\d+$`))
                      )
                        return 'error';

                      return !Number.isNaN(parseFloat(replacedValue))
                        ? parseFloat(replacedValue)
                        : 'error';
                    },
                    min: {
                      value: children.min_val,
                      message: `Значение не может быть меньше чем ${children.min_val}`,
                    },
                    max: {
                      value: children.max_val,
                      message: `Значение не может быть больше чем ${children.max_val}`,
                    },
                    pattern: {
                      value: /^\d*\.?\d*$/,
                      message: 'Неверный формат числа',
                    },
                  }
                )}
                error={
                  errors[
                    `${children.fieldType.replace('_scheme', '')}-${
                      children.id
                    }`
                  ]
                    ? errors[
                        `${children.fieldType.replace('_scheme', '')}-${
                          children.id
                        }`
                      ]?.message?.toString()
                    : null
                }
              />
            );
          case 'real_field_scheme':
            return (
              <TextInput
                sx={() => ({
                  flex: 2,
                })}
                {...register(
                  `${children.fieldType.replace('_scheme', '')}-${children.id}`,
                  {
                    required: children.required
                      ? 'Поле обязательно к заполнению'
                      : false,
                    setValueAs: (val) => {
                      const replacedValue =
                        typeof val === 'string' ? val.replace(',', '.') : val;

                      // Пришлось дополнительно валидировать тут потому что я криворукое мудило и не смог заставить
                      // эту регулярку работать в свойстве pattern
                      if (
                        !replacedValue
                          .toString()
                          .match(
                            new RegExp(
                              `^[+|-]?\\d+[.|,]?\\d{0,` +
                                children.digits_after_point +
                                `}$`
                            )
                          )
                      )
                        return 'error';

                      return !Number.isNaN(parseFloat(replacedValue))
                        ? parseFloat(replacedValue)
                        : 'error';
                    },
                    min: {
                      value: children.min_val,
                      message: `Значение не может быть меньше чем ${children.min_val}`,
                    },
                    max: {
                      value: children.max_val,
                      message: `Значение не может быть больше чем ${children.max_val}`,
                    },
                    pattern: {
                      value: /^\d*\.?\d*$/,
                      message: children.digits_after_point
                        ? `Введите число, содержащее максимум ${children.digits_after_point} знаков после запятой`
                        : 'Неверный формат числа',
                    },
                  }
                )}
                error={
                  errors[
                    `${children.fieldType.replace('_scheme', '')}-${
                      children.id
                    }`
                  ]
                    ? errors[
                        `${children.fieldType.replace('_scheme', '')}-${
                          children.id
                        }`
                      ]?.message?.toString()
                    : null
                }
              />
            );
          case 'datetime_field_scheme':
            return (
              <Flex direction="row" justify="space-between" gap={30}>
                {children.subtype !== 'time' && (
                  <Controller
                    control={control}
                    render={({
                      field: {
                        onChange,
                        value = (children.value || '') as string,
                      },
                    }) => {
                      return (
                        <DatePicker
                          locale="ru"
                          labelFormat="MM/YYYY"
                          inputFormat="DD/MM/YYYY"
                          clearable={false}
                          sx={{ flex: 1 }}
                          value={
                            !value
                              ? dateTimeValues[
                                  `${children.fieldType?.replace(
                                    '_scheme',
                                    ''
                                  )}-${children.id}`
                                ]
                              : new Date(value)
                          }
                          error={
                            (errors || {})[
                              `${children.fieldType?.replace('_scheme', '')}-${
                                children.id
                              }`
                            ]
                              ? (errors || {})[
                                  `${children.fieldType?.replace(
                                    '_scheme',
                                    ''
                                  )}-${children.id}`
                                ]?.message?.toString()
                              : null
                          }
                          onChange={(e) => {
                            onChange(e);
                          }}
                        />
                      );
                    }}
                    {...register(
                      `${children.fieldType?.replace('_scheme', '')}-${
                        children.id
                      }`,
                      {
                        required: children.required
                          ? 'Поле обязательно к заполнению'
                          : false,
                      }
                    )}
                  />
                )}
                {children.subtype !== 'date' && (
                  <Controller
                    control={control}
                    render={({
                      field: {
                        onChange,
                        value = (children.value || '') as string,
                      },
                    }) => (
                      <TimeInput
                        sx={{ flex: 1 }}
                        withSeconds
                        value={
                          !value
                            ? dateTimeValues[
                                `${children.fieldType?.replace(
                                  '_scheme',
                                  ''
                                )}-${children.id}`
                              ]
                            : new Date(value)
                        }
                        error={
                          (errors || {})[
                            `${children.fieldType?.replace('_scheme', '')}-${
                              children.id
                            }`
                          ]
                            ? (errors || {})[
                                `${children.fieldType?.replace(
                                  '_scheme',
                                  ''
                                )}-${children.id}`
                              ]?.message?.toString()
                            : null
                        }
                        onChange={(e) => {
                          onChange(e);
                        }}
                      />
                    )}
                    {...register(
                      `${children.fieldType?.replace('_scheme', '')}-${
                        children.id
                      }`,
                      {
                        required: children.required
                          ? 'Поле обязательно к заполнению'
                          : false,
                      }
                    )}
                  />
                )}
              </Flex>
            );

          default:
            return <>Очень страшно. Мы не знаем что это такое </>;
        }
      })()}
    </Flex>
  ));

  return (
    <>
      <Flex
        pos="relative"
        sx={{
          bottom: '41px',
          gap: '10px',
          alignItems: 'end',
          maxWidth: '95%',
        }}
      >
        <Title
          order={3}
          sx={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            fontWeight: 500,
          }}
          maw="350px"
        >
          {chosenTypeName}
        </Title>
        <Text sx={{ color: '#A0A0A0' }}>создание документа</Text>
      </Flex>
      <Box mt="-30px">
        <Input.Wrapper
          label="Название типа документа"
          styles={{
            label: {
              marginBottom: '10px',
              fontSize: '16px',
              fontWeight: 400,
            },
          }}
        >
          <Input
            sx={{
              marginLeft: '0',
              borderRadius: '11px',
              fontWeight: 500,
            }}
            disabled
            placeholder={chosenTypeName}
          />
        </Input.Wrapper>
        <Text mt="19.5px" sx={{ fontSize: '16px' }}>
          Поля документа
        </Text>
        <ScrollArea
          sx={{ height: '350px', paddingRight: 15, paddingBottom: 30 }}
        >
          <form>
            {FieldsForm}
            <Flex gap={10} align="center">
              <FileButton
                accept="image/png,image/jpeg,image/jpg,application/pdf"
                onChange={setFile}
              >
                {(props) => (
                  <Button
                    sx={{
                      fontWeight: 400,
                      borderRadius: '8px',
                    }}
                    {...props}
                  >
                    Загрузить скан файла
                  </Button>
                )}
              </FileButton>
              {file && (
                <Text size="sm" align="center">
                  Имя Файла: {file.name}
                </Text>
              )}
            </Flex>
          </form>
        </ScrollArea>
        <Group position="right">
          <Button
            variant="outline"
            sx={{
              border: 'none',
              bg: 'none',
              color: '#A0A0A0',
              fontWeight: 400,
              borderRadius: '8px',
              '&:hover': {
                background: '#EDF2FF',
              },
            }}
            onClick={() => {
              closeModal('addDocument');
              dispatch(setCurrentTypeName(''));
            }}
          >
            Отменить
          </Button>
          <Button
            loading={isLoading}
            sx={{
              fontWeight: 400,
              borderRadius: '8px',
            }}
            disabled={Object.keys(errors).length !== 0 || !file}
            onClick={async () => {
              const allValues = getValues();
              // for (const [key, value] of Object.entries(allValues)) {
              //   if (key.includes('datetime')) {
              //     setValue(
              //       key,
              //       new Date(
              //         new Date(value).setDate(new Date(value).getDate() + 1)
              //       ).toISOString()
              //     );
              //   }
              // }

              if (file) {
                console.log(getValues());
                const result = await generateDocumentFromAddDocumentForm({
                  directoryId: currentDirectoryId,
                  fields: getValues(),
                  schemeId: chosenTypeId,
                  scanFile: file,
                });
                sendDocument(result)
                  .unwrap()
                  .then(() => {
                    showNotification({
                      message: 'Файл успешно создан',
                    });
                    closeAllModals();
                  });
              }
            }}
          >
            Сохранить
          </Button>
        </Group>
      </Box>
    </>
  );
};
