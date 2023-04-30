/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, FC, useRef, useEffect } from 'react';

import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Flex,
  Input,
  Kbd,
  ScrollArea,
  Text,
  TextInput,
  Title,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { ru } from 'chrono-node';
// First import locale data
import 'dayjs/locale/ru';
import { showNotification } from '@mantine/notifications';
import { closeAllModals, openConfirmModal } from '@mantine/modals';
import { FieldValues, useForm } from 'react-hook-form';
import {
  IconCheck,
  IconMinus,
  IconPencil,
  IconPlus,
  IconX,
} from '@tabler/icons';
import {
  Cropper,
  ReactCropperElement as ReactCropperElementWithoutCropBox,
} from 'react-cropper';

import { PagesController } from 'components/FilesTable/Modals/SmartImport/PagesController';

import { ReactComponent as Question } from 'assets/SVG/Question.svg';

import { useMap } from 'hooks/useMap';
import { useModalTypesAndFields } from 'hooks/useModalSchemesAndFields';

import { textInputHandler } from 'utils/textInputHandler';
import { generateDocumentFromOcrFields } from 'utils/generateOcrDocument';

import { useTypedDispatch, useTypedSelector } from 'store/ReduxHooks';
import { selectCurrentTypeName } from 'store/slices/currentType';
import { FieldsTypes, TextProcessingMode } from 'store/api/document/types';
import { selectCurrentDirectoryId } from 'store/slices/currentDirectory';
import {
  useCreateDocumentMutation,
  useSendFragmentMutation,
} from 'store/api/document';
import {
  selectIsScanVisible,
  toggleIsScanVisible,
} from 'store/slices/ocrSlice';

import 'styles/cropperstyles.css';
import { useMediaQuery, useOs } from '@mantine/hooks';
import InputDateTime from 'components/Inputs/InputDateTime';
import { VerticalSlider } from 'components/VerticalSlider/VerticalSlider';
import { clearAll, setDateTime } from 'store/slices/dateTime';

type ReactCropperElement = ReactCropperElementWithoutCropBox & {
  cropper: { cropBox: HTMLElement; zoom: (zoomValue: number) => void };
};

interface ManualSelectionFormProps {
  schemeId: number;
  documentsData: { original: string; documentName: string }[];
  previewsUrls: string[];
}

export const ManualSelectionForm: FC<ManualSelectionFormProps> = ({
  schemeId,
  documentsData,
  previewsUrls,
}) => {
  const dispatch = useTypedDispatch();
  const { schemesAll } = useModalTypesAndFields();

  const heightMatch = useMediaQuery('(min-height: 1200px)');

  const { fields } = schemesAll.find((scheme) => scheme.id === schemeId) ?? {
    fields: {},
  };

  const chosenTypeName = useTypedSelector(selectCurrentTypeName);

  const os = useOs();

  const [sendDocument, { isLoading }] = useCreateDocumentMutation();
  const currentDirectoryId = useTypedSelector(selectCurrentDirectoryId);
  const FieldsData: FieldsTypes[] = [];

  const [activePage, setPage] = useState(1);

  useEffect(() => {
    dispatch(clearAll());
    return () => {
      dispatch(clearAll());
    };
  }, [dispatch]);

  const isScanVisible = useTypedSelector(selectIsScanVisible);
  const [isEdit, setIsEdit] = useState(true);

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [uploadFragment] = useSendFragmentMutation();

  const {
    register,
    formState: { errors },
    getValues,
    setValue,
    handleSubmit,
    control,
  } = useForm({
    mode: 'onChange',
  });

  for (let i = 0; i < documentsData.length; i++) {
    for (const [key, value] of Object.entries(fields)) {
      (value as any[]).forEach((field) => {
        FieldsData.push({
          fieldType: key,
          id: field.id,
          name: field.name,
          local_index: field.local_index,
          min_val: field.min_val,
          max_val: field.max_val,
          value: '' as string | number | boolean,
          digits_after_point: field.digits_after_point,
          max_length: field.max_length,
          required: field.required,
          lettercase: field.lettercase,
          page: i + 1,
          subtype: field.subtype,
        });
      });
    }
  }

  FieldsData.sort((a, b) =>
    a.local_index > b.local_index ? 1 : a.local_index < b.local_index ? -1 : 0
  );

  FieldsData.sort((a, b) =>
    a.page === b.page && a.local_index > b.local_index
      ? 1
      : a.local_index < b.local_index
      ? -1
      : 0
  );

  const [cropBoxMap, actions] = useMap<string, Cropper.CropBoxData>();

  const [cropper, setCropper] = useState<Cropper>();
  const cropperRef = useRef<ReactCropperElement>(null);

  const [valueForRefresh, setValueForRefresh] = useState<1 | -1>(1);

  const toggleEffect = () =>
    setValueForRefresh((prev) => (prev === 1 ? -1 : 1));

  useEffect(() => {
    const northEastPointIndex = 13;

    if (
      cropperRef.current &&
      cropperRef.current.cropper.cropBox &&
      cropperRef.current.cropper.cropBox.children[northEastPointIndex]
    ) {
      const northEastPoint = cropperRef.current.cropper.cropBox.children[
        northEastPointIndex
      ] as HTMLElement;
      northEastPoint.onclick = () => cropperRef.current?.cropper.clear();
    }

    if (
      focusedField &&
      cropper &&
      cropper?.getCropBoxData() &&
      cropper?.getCropBoxData().width >= 10 &&
      cropper?.getCropBoxData().height >= 10
    ) {
      cropper.getCroppedCanvas().toBlob((blob) => {
        if (!blob) return;

        const fd = new FormData();

        fd.append('fragment', blob);

        uploadFragment(fd)
          .unwrap()
          .then((res) => {
            if (
              focusedField.includes('date') ||
              focusedField.includes('time')
            ) {
              dispatch(
                setDateTime({
                  [focusedField]: ru.parseDate(res.text.split('\n\f')[0]),
                })
              );
              console.log(ru.parseDate(res.text.split('\n\f')[0]));
              setValue(focusedField, ru.parseDate(res.text.split('\n\f')[0]), {
                shouldValidate: true,
              });
            } else {
              setValue(focusedField, res.text.split('\n\f')[0], {
                shouldValidate: true,
              });
            }
          });
      }, 'image/png');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueForRefresh]);

  const focusFieldHandler = (fieldId: string) => {
    if (!cropper) return;
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

  const FieldsForm = FieldsData.filter(
    (currentFields) => currentFields.page === activePage
  ).map((children) => (
    <Box key={children.page.toString() + '-' + children.id.toString()}>
      <Flex my={15} align="center" gap="10px">
        <Text w="20%" lineClamp={2}>
          {children.name}
        </Text>
        <Input.Wrapper sx={{ flex: 2 }}>
          {(() => {
            switch (children.fieldType) {
              case 'bool_field_scheme':
                return (
                  <Checkbox
                    label={children.name}
                    h={20}
                    defaultChecked={
                      children.value !== null
                        ? (children.value as boolean)
                        : false
                    }
                    {...register(`bool_field-${children.page}${children.id}`, {
                      required: children.required
                        ? 'Поле обязательно к заполнению'
                        : false,
                    })}
                    error={
                      errors[`bool_field-${children.page}${children.id}`]
                        ? errors[
                            `bool_field-${children.page}${children.id}`
                          ]?.message?.toString()
                        : null
                    }
                    disabled={!isEdit}
                  />
                );
              case 'text_field_scheme':
                return (
                  <TextInput
                    styles={{
                      input: {
                        fontSize: '16px',
                        ['&:disabled']: {
                          color: '#000',
                        },
                      },
                    }}
                    defaultValue={
                      children.value !== null ? children.value.toString() : ''
                    }
                    onFocus={() =>
                      focusFieldHandler(
                        `text_field-${children.page}${children.id}`
                      )
                    }
                    withAsterisk={children.required}
                    {...register(`text_field-${children.page}${children.id}`, {
                      required: children.required
                        ? 'Это поле обязательно'
                        : false,
                      setValueAs: (val) =>
                        textInputHandler(
                          val,
                          children.lettercase as TextProcessingMode
                        ),
                      maxLength: children.max_length
                        ? {
                            value: children.max_length,
                            message: `Длина значения должна быть не больше ${children.max_length}`,
                          }
                        : undefined,
                    })}
                    error={
                      errors[`text_field-${children.page}${children.id}`]
                        ? errors[
                            `text_field-${children.page}${children.id}`
                          ]?.message?.toString()
                        : null
                    }
                    disabled={!isEdit}
                  />
                );
              case 'int_field_scheme':
                return (
                  <TextInput
                    defaultValue={
                      children.value !== null ? (children.value as number) : ''
                    }
                    onFocus={() =>
                      focusFieldHandler(
                        `int_field-${children.page}${children.id}`
                      )
                    }
                    {...register(`int_field-${children.page}${children.id}`, {
                      required: children.required,
                      setValueAs: (val) =>
                        !Number.isNaN(Number(val))
                          ? parseInt(val)
                            ? parseInt(val)
                            : 0
                          : 'error',
                      min: {
                        value: children.min_val,
                        message: `Значение поля не может быть меньше чем ${children.min_val}`,
                      },
                      max: {
                        value: children.max_val,
                        message: `Значение поля не может быть больше чем ${children.max_val}`,
                      },
                      pattern: {
                        value: /^(\+|-)?\d+$/,
                        message: 'Введите целое число',
                      },
                    })}
                    error={
                      errors[`int_field-${children.page}${children.id}`]
                        ? errors[
                            `int_field-${children.page}${children.id}`
                          ]?.message?.toString()
                        : null
                    }
                    disabled={!isEdit}
                    styles={() => ({
                      input: {
                        fontSize: '16px',
                        ['&:disabled']: {
                          color: '#000',
                        },
                      },
                    })}
                  />
                );
              case 'real_field_scheme':
                return (
                  <TextInput
                    defaultValue={
                      children.value !== null ? (children.value as number) : ''
                    }
                    onFocus={() =>
                      focusFieldHandler(
                        `real_field-${children.page}${children.id}`
                      )
                    }
                    {...register(
                      `real_field-${children.page}${children.id}`,

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
                        required: children.required,
                        min: {
                          value: children.min_val,
                          message: `Значение поля не может быть меньше чем ${children.min_val}`,
                        },
                        max: {
                          value: children.max_val,
                          message: `Значение поля не может быть больше чем ${children.max_val}`,
                        },

                        pattern: {
                          value: /^\d*\.?\d*$/,
                          message: `Введите число, содержащее максимум ${children.digits_after_point} знаков после запятой`,
                        },
                      }
                    )}
                    error={
                      errors[`real_field-${children.page}${children.id}`]
                        ? errors[
                            `real_field-${children.page}${children.id}`
                          ]?.message?.toString()
                        : null
                    }
                    disabled={!isEdit}
                    styles={() => ({
                      input: {
                        fontSize: '16px',
                        ['&:disabled']: {
                          color: '#000',
                        },
                      },
                    })}
                  />
                );
              case 'datetime_field_scheme':
                return (
                  <InputDateTime
                    isRecognition={true}
                    register={register}
                    fieldInfo={children}
                    control={control}
                    cropBoxMap={cropBoxMap}
                    focusedField={focusedField}
                    actions={actions}
                    setFocusedField={setFocusedField}
                    cropper={cropper}
                    page={children.page}
                  />
                );
              default:
                return <>Очень страшно. Мы не знаем что это такое</>;
            }
          })()}
        </Input.Wrapper>
      </Flex>
    </Box>
  ));

  useEffect(() => {
    if (!cropper) return;

    const keyUpHandler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Alt':
          cropper.setDragMode('crop');
          break;

        default:
      }
    };

    const keyDownHandler = (e: KeyboardEvent) => {
      switch (e.key) {
        // Crop the image
        case 'Enter':
          cropper.crop();
          break;
        // Clear crop area
        case 'Escape':
          cropper.clear();
          break;
        // Move to the left
        case 'ArrowRight':
          e.preventDefault();
          cropper.move(-10, 0);
          break;
        // Move to the top
        case 'ArrowUp':
          e.preventDefault();
          cropper.move(0, -10);
          break;
        // Move to the right
        case 'ArrowLeft':
          e.preventDefault();
          cropper.move(10, 0);
          break;
        // Move to the bottom
        case 'ArrowDown':
          e.preventDefault();
          cropper.move(0, 10);
          break;
        // Enter crop mode
        case 'c':
          cropper.setDragMode('crop');
          break;
        // Enter move mode
        case 'Alt':
          cropper.setDragMode('move');
          break;
        // Zoom in
        case '=':
          cropper.zoom(0.1);
          break;
        // Zoom out
        case '-':
          cropper.zoom(-0.1);
          break;
        default:
      }
    };

    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);

    return () => {
      window.removeEventListener('keydown', keyDownHandler);
      window.removeEventListener('keyup', keyUpHandler);
    };
  }, [cropper]);

  const onSubmit = async () => {
    const allValues = getValues();
    const newDocuments = [];
    const subtypes = [];
    for (let i = 0; i < documentsData.length; i++) {
      const currentValues: FieldValues = {};
      for (let key in allValues) {
        let val = allValues[key];
        if (key.includes('datetime')) {
          val = new Date(
            new Date(allValues[key]).setDate(
              new Date(allValues[key]).getDate() + 1
            )
          ).toISOString();
        }
        if (key.includes('date') || key.includes('time')) {
          subtypes.push(key.slice(key.lastIndexOf('-') + 1, key.length));
          key = key.slice(0, key.lastIndexOf('-'));
        }
        if (
          key.slice(key.indexOf('-') + 1, key.indexOf('-') + 2) ===
          (i + 1).toString()
        ) {
          if (key.slice(key.indexOf('-') + 1, key.indexOf('-') + 3) !== '10') {
            currentValues[
              key.slice(0, key.indexOf('-') + 1) +
                key.slice(key.indexOf('-') + 2, key.length)
            ] = val;
          } else {
            if (key.slice(key.indexOf('-') + 1, key.length).length < 4) {
              currentValues[
                key.slice(0, key.indexOf('-') + 1) +
                  key.slice(key.indexOf('-') + 3, key.length)
              ] = val;
            } else {
              currentValues[
                key.slice(0, key.indexOf('-') + 1) +
                  key.slice(key.length - 2, key.length)
              ] = val;
            }
          }
        }
      }
      newDocuments.push({
        documentsName: documentsData[i].documentName,
        original: documentsData[i].original,
        fields: currentValues,
      });
    }

    let isError = false;

    for (const doc of newDocuments) {
      for (const [key, value] of Object.entries(doc.fields)) {
        if (value === '' || value === null || value === 'error') {
          showNotification({
            title: 'Ошибка',
            color: 'red',
            icon: <IconX size={16} />,
            message: 'Какие-то поля не заполнены или заполнены неверно!',
          });
          isError = true;
          // setError('input', { type: 'focus' }, { shouldFocus: true });
          return;
        }
      }
    }
    if (!isError) {
      for (let i = 0; i < documentsData.length; i++) {
        const result = await generateDocumentFromOcrFields({
          directoryId: currentDirectoryId,
          fields: newDocuments[i].fields,
          schemeId: schemeId,
          documentName: newDocuments[i].documentsName,
          original: newDocuments[i].original,
          subtype: subtypes[i],
        });
        setIsEdit(false);
        sendDocument(result).unwrap();
      }
      showNotification({
        title: 'Подтверждено',
        color: 'teal',
        icon: <IconCheck size={16} />,
        message: 'Документы успешно добавлены',
      });
      closeAllModals();
      setIsEdit(true);
    }
  };

  const cropperZoomHandler = (zoomValue: number) => {
    if (cropper && cropper.zoom) cropper.zoom(zoomValue);
  };

  return (
    <>
      {isScanVisible && (
        <>
          <Box
            sx={{
              width: '45vw',
              background: 'white',
              borderRadius: '13px',
              height: '100%',
              overflow: 'hidden',
              position: 'absolute',
              left: '105%',
              top: '0',
              boxSizing: 'border-box',
            }}
          >
            {os.includes('windows') ||
            os.includes('macos') ||
            os.includes('linux') ? (
              <Tooltip
                position="bottom-start"
                mr={15}
                styles={(theme) => ({
                  tooltip: {
                    backgroundColor: theme.colors.gray[0],
                    borderColor: theme.colors.gray[4],
                    borderWidth: 2,
                    borderStyle: 'solid',
                    borderRadius: 10,
                    padding: 15,
                  },
                })}
                label={
                  <Flex direction="column" gap={15}>
                    <Title fz={14} fw={500} color="gray.7">
                      Управление с клавиатуры
                    </Title>
                    <Box>
                      <Kbd>{os === 'macos' ? 'OPTION' : 'ALT'}</Kbd>
                      <Text
                        ml={5}
                        sx={{ display: 'inline-block' }}
                        fz={12}
                        color="gray.7"
                      >
                        — режим перемещения
                      </Text>
                    </Box>
                    <Box>
                      <Kbd>ESC</Kbd>
                      <Text
                        ml={5}
                        sx={{ display: 'inline-block' }}
                        fz={12}
                        color="gray.7"
                      >
                        — сброс выделения
                      </Text>
                    </Box>
                    <Box>
                      <Kbd>+</Kbd>
                      <Text
                        mx={2}
                        sx={{ display: 'inline-block' }}
                        fz={12}
                        color="gray.7"
                      >
                        /
                      </Text>
                      <Kbd>-</Kbd>
                      <Text
                        ml={5}
                        sx={{ display: 'inline-block' }}
                        fz={12}
                        color="gray.7"
                      >
                        — масштабирование
                      </Text>
                    </Box>
                    <Box>
                      <Text
                        maw={200}
                        sx={{ display: 'inline-block', whiteSpace: 'pre-line' }}
                        fz={12}
                        color="gray.7"
                      >
                        Для более точной настройки масштаба - используйте
                        слайдер
                      </Text>
                    </Box>
                  </Flex>
                }
              >
                <Box ml="auto" mt={5} w={28} mr={15}>
                  <Question className="question" />
                </Box>
              </Tooltip>
            ) : null}
            <Box
              styles={(theme) => ({
                height: '100%',
                position: 'relative',
              })}
            >
              <Cropper
                src={previewsUrls[activePage - 1]}
                style={{ height: '100%', width: '100%' }}
                // Cropper.js options
                guides={false}
                center={false}
                dragMode="crop"
                ref={cropperRef}
                cropend={toggleEffect}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                responsive={true}
                autoCrop={false}
                onInitialized={(cropperObj) => {
                  setCropper(cropperObj);
                }}
              />
              <Flex
                direction="column"
                gap={10}
                sx={(theme) => ({
                  position: 'absolute',
                  top: '50%',
                  left: '4%',
                })}
              >
                <ActionIcon
                  onClick={() => cropper?.zoom(0.1)}
                  variant="filled"
                  color="indigo.5"
                >
                  <IconPlus />
                </ActionIcon>
                <ActionIcon
                  onClick={() => cropper?.zoom(-0.1)}
                  variant="filled"
                  color="indigo.5"
                >
                  <IconMinus />
                </ActionIcon>
              </Flex>
              <Box
                sx={(theme) => ({
                  position: 'absolute',
                  top: '42%',
                  left: '90%',
                })}
              >
                <VerticalSlider onChange={cropperZoomHandler} />
              </Box>
            </Box>
          </Box>
        </>
      )}
      {documentsData
        .filter((_, index) => index + 1 === activePage)
        .map((_, index) => (
          <Box key={index}>
            <Flex
              pos="relative"
              mb="-20px"
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
                  fontWeight: 500,
                  textOverflow: 'ellipsis',
                  overflowX: 'hidden',
                  whiteSpace: 'nowrap',
                  maxWidth: '60%',
                }}
              >
                {documentsData[activePage - 1].documentName}
              </Title>
              <Text sx={{ color: '#A0A0A0' }}>просмотр документа</Text>
            </Flex>

            <TextInput
              mb="17px"
              label="Название типа документа"
              styles={{
                label: {
                  marginBottom: '10px',
                  fontSize: 20,
                  fontWeight: 400,
                  marginLeft: '0',
                },
                input: {
                  fontSize: '16px',
                },
              }}
              sx={{
                marginLeft: '0',
                borderRadius: '11px',
                fontWeight: 500,
              }}
              disabled
              placeholder={chosenTypeName}
            />
            <Flex direction="column" mb={5}>
              <Flex justify="space-between" align="center" mb={5}>
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <ScrollArea
                sx={{
                  overflowY: 'auto',
                  maxHeight: heightMatch ? '50vh' : '30vh',
                }}
              >
                {FieldsForm}
              </ScrollArea>
              <Flex direction="column">
                <UnstyledButton
                  w="fit-content"
                  onClick={() => {
                    dispatch(toggleIsScanVisible());
                  }}
                >
                  <Text
                    sx={{
                      borderRadius: 10,
                      padding: '15px 0px 0',
                      fontWeight: 400,
                      textDecoration: 'underline',
                      textDecorationSkipInk: 'none',
                    }}
                    color="#91A7FF"
                  >
                    {isScanVisible
                      ? 'Скрыть скан документа'
                      : 'Посмотреть скан документа'}
                  </Text>
                </UnstyledButton>
                {documentsData.length > 1 && (
                  <PagesController
                    activePage={activePage}
                    setPage={(page) => {
                      setPage(page);
                      setFocusedField(null);
                    }}
                    amountOfPages={documentsData.length}
                  />
                )}
                <Flex gap="16px" justify="end">
                  {documentsData.length > 1 && (
                    <Button
                      onClick={() =>
                        openConfirmModal({
                          modalId: 'removePageFromOcrDoc',
                          title: 'Подтверждение удаления',
                          centered: true,
                          children: (
                            <Flex>
                              <Question />
                              <Text sx={{ marginLeft: '5px' }}>
                                Вы уверены, что хотите удалить{' '}
                                {documentsData[activePage - 1].documentName}?
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
                            previewsUrls.splice(activePage - 1, 1);
                            documentsData.splice(activePage - 1, 1);
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
                  )}

                  <Button
                    loading={isLoading}
                    type="submit"
                    sx={{
                      fontWeight: 400,
                      borderRadius: '8px',
                    }}
                    onClick={() => {
                      console.log(documentsData);
                    }}
                  >
                    Сохранить
                  </Button>
                </Flex>
              </Flex>
            </form>
          </Box>
        ))}
    </>
  );
};
