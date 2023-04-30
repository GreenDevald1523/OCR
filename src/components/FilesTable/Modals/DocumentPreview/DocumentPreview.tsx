import { FC, useState } from 'react';
import {
  ActionIcon,
  Button,
  Checkbox,
  Flex,
  Input,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import {
  BoolFieldSchemeEntityOrFileFieldSchemeEntityOrLinkFieldSchemeEntityOrUserFieldSchemeEntity,
  Document,
  FieldsTypes,
  IntFieldsEntityOrRealFieldEntity,
  IntFieldsSchemeEntity,
  RealFieldSchemeEntity,
  TextFieldSchemeEntity,
  TimeFieldEntityOrTextFieldEntity,
} from 'store/api/document/types';
import { useForm } from 'react-hook-form';
import { IconPencil } from '@tabler/icons';
import {
  useDeleteDocumentMutation,
  useUpdateDocumentMutation,
} from 'store/api/document';
import { closeAllModals, openConfirmModal } from '@mantine/modals';

import { ReactComponent as Question } from '../../../../assets/SVG/Question.svg';
import { DocumentRawPreview } from './DocumetRawPreview';
import { useScheme } from '../../../../hooks/useScheme';
import { createShortFieldsFromFields } from '../../../../utils/createShortFieldsFromFields';
import { showNotification } from '@mantine/notifications';
import { textInputHandler } from '../../../../utils/textInputHandler';
import InputDateTime from 'components/Inputs/InputDateTime';

interface DocumentPreviewProps {
  document: Document;
}

export const DocumentPreview: FC<DocumentPreviewProps> = ({ document }) => {
  const {
    register,
    getValues,
    formState: { errors, dirtyFields },
    control,
  } = useForm({
    defaultValues: document.fields,
    mode: 'onChange',
  });

  const [isEdit, setIsEdit] = useState(false);

  const [isDocumentPreview, setIsDocumentPreview] = useState(false);

  const [updateDocument, { isLoading }] = useUpdateDocumentMutation();

  const [deleteDocument] = useDeleteDocumentMutation();

  const scheme = useScheme(document.scheme);

  const submitHandler = () => {
    updateDocument({
      id: document.id,
      fields: createShortFieldsFromFields(getValues()),
    })
      .unwrap()
      .then(() => {
        closeAllModals();
        showNotification({ message: 'Файл успешно изменён' });
      });
  };

  return (
    <Flex direction="column" gap={15}>
      {document ? (
        <>
          {isDocumentPreview && (
            <DocumentRawPreview
              isPdf={document.original_name.split('.').at(-1) === 'pdf'}
              opened={isDocumentPreview}
              onClose={() => {
                setIsDocumentPreview(false);
              }}
              src={document.original as unknown as string}
            />
          )}
          <Flex direction="column">
            <Text fz={22} fw={500} mb={10}>
              Название типа документов
            </Text>
            <Input.Wrapper>
              <TextInput disabled defaultValue={scheme ? scheme.title : ''} />
            </Input.Wrapper>
          </Flex>
          <Flex direction="column" mb={5}>
            <Flex justify="space-between" align="center">
              <Text fz={20} fw={400}>
                Поля документа
              </Text>
              <ActionIcon
                sx={{ width: 40, height: 32, borderRadius: 10 }}
                variant="filled"
                color="dark"
                onClick={() => setIsEdit((prev) => !prev)}
              >
                <IconPencil size={20} />
              </ActionIcon>
            </Flex>
          </Flex>
          {/* Тут парсим поля документа и отображаем их как надо */}
          {Object.entries(document.fields).map(([key, value]) => {
            switch (key) {
              case 'text_field':
                return value.map((field: TimeFieldEntityOrTextFieldEntity) => {
                  const schemeField =
                    scheme && scheme.fields.text_field_scheme
                      ? scheme.fields.text_field_scheme.find(
                          (fieldOfList) => fieldOfList.id === field.id
                        ) || ({} as TextFieldSchemeEntity)
                      : ({} as TextFieldSchemeEntity);

                  const fieldIndexForForm =
                    document.fields.text_field?.findIndex(
                      (textField) => field.name === textField.name
                    ) ?? 0;

                  return (
                    <Flex gap={15} key={field.name} align="center">
                      <Text w={140} fz={18.5} fw={500}>
                        {field.name}
                      </Text>
                      <Input.Wrapper
                        error={
                          errors?.text_field &&
                          errors?.text_field[fieldIndexForForm]?.value?.message
                        }
                        sx={{ flex: 2 }}
                      >
                        <TextInput
                          {...register(
                            `text_field.${fieldIndexForForm}.value`,
                            {
                              required: schemeField.required
                                ? 'Это поле обязательно'
                                : false,
                              setValueAs: (val) =>
                                textInputHandler(val, schemeField.lettercase),
                              maxLength: schemeField.max_length
                                ? {
                                    value: schemeField.max_length,
                                    message: `Длина значения должна быть не больше ${schemeField.max_length}`,
                                  }
                                : undefined,
                            }
                          )}
                          disabled={!isEdit}
                          styles={{
                            input: {
                              ['&:disabled']: {
                                color: '#000',
                              },
                            },
                          }}
                        />
                      </Input.Wrapper>
                    </Flex>
                  );
                });
              case 'int_field':
                return value.map((field: IntFieldsEntityOrRealFieldEntity) => {
                  const schemeField =
                    scheme && scheme.fields.int_field_scheme
                      ? scheme.fields.int_field_scheme.find(
                          (fieldOfList) => fieldOfList.id === field.id
                        ) || ({} as IntFieldsSchemeEntity)
                      : ({} as IntFieldsSchemeEntity);

                  const fieldIndexForForm =
                    document.fields.int_field?.findIndex(
                      (intField) => field.name === intField.name
                    ) ?? 0;

                  return (
                    <Flex gap={15} key={field.name} align="center">
                      <Text w={140} fz={18.5} fw={500}>
                        {field.name}
                      </Text>
                      <Input.Wrapper
                        error={
                          errors?.int_field &&
                          errors?.int_field[fieldIndexForForm]?.value?.message
                        }
                        sx={{ flex: 2 }}
                      >
                        <TextInput
                          {...register(
                            `int_field.${fieldIndexForForm ?? 0}.value`,
                            {
                              required: schemeField.required,
                              setValueAs: (val) =>
                                !Number.isNaN(Number(val))
                                  ? parseInt(val)
                                    ? parseInt(val)
                                    : 0
                                  : 'error',
                              min: {
                                value: schemeField.min_val,
                                message: `Значение поля не может быть меньше чем ${schemeField.min_val}`,
                              },
                              max: {
                                value: schemeField.max_val,
                                message: `Значение поля не может быть больше чем ${schemeField.max_val}`,
                              },
                              pattern: {
                                value: /^(\+|-)?\d+$/,
                                message: 'Введите целое число',
                              },
                            }
                          )}
                          disabled={!isEdit}
                          styles={{
                            input: {
                              ['&:disabled']: {
                                color: '#000',
                              },
                            },
                          }}
                        />
                      </Input.Wrapper>
                    </Flex>
                  );
                });
              case 'real_field':
                return value.map((field: IntFieldsEntityOrRealFieldEntity) => {
                  const schemeField =
                    scheme && scheme.fields.real_field_scheme
                      ? scheme.fields.real_field_scheme.find(
                          (fieldOfList) => fieldOfList.id === field.id
                        ) || ({} as RealFieldSchemeEntity)
                      : ({} as RealFieldSchemeEntity);

                  const fieldIndexForForm =
                    document.fields.real_field?.findIndex(
                      (realField) => field.name === realField.name
                    ) ?? 0;

                  return (
                    <Flex gap={15} key={field.name} align="center">
                      <Text w={140} fz={18.5} fw={500}>
                        {field.name}
                      </Text>
                      <Input.Wrapper
                        error={
                          errors?.real_field &&
                          errors?.real_field[fieldIndexForForm]?.value?.message
                        }
                        sx={{ flex: 2 }}
                      >
                        <TextInput
                          {...register(
                            `real_field.${fieldIndexForForm ?? 0}.value`,

                            {
                              setValueAs: (val) => {
                                const replacedValue =
                                  typeof val === 'string'
                                    ? val.replace(',', '.')
                                    : val;

                                // Пришлось дополнительно валидировать тут потому что я криворукое мудило и не смог заставить
                                // эту регулярку работать в свойстве pattern
                                if (
                                  !replacedValue
                                    .toString()
                                    .match(
                                      new RegExp(
                                        `^\\d+[.|,]?\\d{0,` +
                                          schemeField.digits_after_point +
                                          `}$`
                                      )
                                    )
                                )
                                  return 'error';

                                return !Number.isNaN(parseFloat(replacedValue))
                                  ? parseFloat(replacedValue)
                                  : 'error';
                              },
                              required: schemeField.required,
                              min: {
                                value: schemeField.min_val,
                                message: `Значение поля не может быть меньше чем ${schemeField.min_val}`,
                              },
                              max: {
                                value: schemeField.max_val,
                                message: `Значение поля не может быть больше чем ${schemeField.max_val}`,
                              },
                              pattern: {
                                value: /^\d*\.?\d*$/,
                                message: `Введите число, содержащее максимум ${schemeField.digits_after_point} знаков после запятой`,
                              },
                            }
                          )}
                          disabled={!isEdit}
                          styles={{
                            input: {
                              ['&:disabled']: {
                                color: '#000',
                              },
                            },
                          }}
                        />
                      </Input.Wrapper>
                    </Flex>
                  );
                });
              case 'bool_field':
                return value.map(
                  (
                    field: BoolFieldSchemeEntityOrFileFieldSchemeEntityOrLinkFieldSchemeEntityOrUserFieldSchemeEntity
                  ) => {
                    const fieldIndexForForm =
                      document.fields.bool_field?.findIndex(
                        (boolField) => field.name === boolField.name
                      ) ?? 0;

                    return (
                      <Flex gap={15} key={field.name} align="center">
                        <Text w={140} fz={18.5} fw={500}>
                          {field.name}
                        </Text>
                        <Input.Wrapper
                          error={
                            errors?.bool_field &&
                            errors?.bool_field[fieldIndexForForm]?.value
                              ?.message
                          }
                          sx={{ flex: 2 }}
                        >
                          <Checkbox
                            {...register(
                              `bool_field.${fieldIndexForForm ?? 0}.value`
                            )}
                            disabled={!isEdit}
                            styles={{
                              input: {
                                ['&:disabled']: {
                                  color: '#000',
                                },
                              },
                            }}
                          />
                        </Input.Wrapper>
                      </Flex>
                    );
                  }
                );
              case 'datetime_field':
                return value.map(
                  (field: {
                    id: number;
                    local_index: number;
                    name: string;
                    subtype: FieldsTypes['subtype'];
                    value: string;
                  }) => (
                    <InputDateTime
                      isRecognition={false}
                      key={field.id}
                      register={register}
                      fieldInfo={field}
                      control={control}
                    />
                  )
                );
              default:
                break;
            }
          })}
          <UnstyledButton
            w="fit-content"
            onClick={() => {
              setIsDocumentPreview(true);
            }}
          >
            <Text
              sx={{
                borderRadius: 10,
                marginBottom: 30,
                fontWeight: 400,
                textDecoration: 'underline',
                textDecorationSkipInk: 'none',
              }}
              color="#91A7FF"
            >
              Посмотреть скан документа
            </Text>
          </UnstyledButton>
          <Flex justify="end">
            <Flex gap={15}>
              <Button
                onClick={() =>
                  openConfirmModal({
                    title: 'Подтверждение удаления',
                    centered: true,
                    children: (
                      <Flex>
                        <Question />
                        <Text sx={{ marginLeft: '5px' }}>
                          Вы уверены, что хотите удалить{' '}
                          {document.original_name}?
                        </Text>
                      </Flex>
                    ),
                    labels: { confirm: 'Удалить', cancel: 'Отменить' },
                    cancelProps: {
                      sx: {
                        border: 'none',
                        bg: 'none',
                        color: '#A0A0A0',
                        fontWeight: 400,
                        borderRadius: '8px',
                        '&:hover': {
                          background: '#EDF2FF',
                        },
                      },
                    },
                    confirmProps: {
                      styles: (theme) => ({
                        root: {
                          fontWeight: 400,
                          borderRadius: '8px',
                          backgroundColor: theme.colors.red[6],

                          ['&:hover']: {
                            backgroundColor: theme.colors.red[7],
                          },
                        },
                      }),
                    },
                    onConfirm: () => {
                      deleteDocument(document.id)
                        .unwrap()
                        .then(() => closeAllModals());
                    },
                  })
                }
                sx={(theme) => ({
                  borderRadius: 10,
                  padding: '2px 15px',
                  fontWeight: 500,
                  backgroundColor: theme.colors.red[5],

                  ['&:hover']: {
                    backgroundColor: theme.colors.red[6],
                  },
                })}
                color="red"
              >
                Удалить документ
              </Button>
              <Button
                disabled={
                  Object.keys(errors).length !== 0 ||
                  Object.keys(dirtyFields).length === 0
                }
                onClick={submitHandler}
                loading={isLoading}
                sx={{ borderRadius: 10, padding: '2px 15px', fontWeight: 500 }}
              >
                Принять
              </Button>
            </Flex>
          </Flex>
        </>
      ) : null}
    </Flex>
  );
};
