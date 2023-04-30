import { useState } from 'react';
import { Flex, Title, Input, Select, Box, Text, Button } from '@mantine/core';
import { useTypedDispatch, useTypedSelector } from 'store/ReduxHooks';
import {
  selectNewSchemeName,
  selectNewSchemeFields,
  addFieldToNewScheme,
} from 'store/slices/newSchemeSlice/newSchemeSlice';
import { closeModal } from '@mantine/modals';
import { FC } from 'react';
import { showNotification } from '@mantine/notifications';
import {
  FieldsParams,
  SupportedFieldTypes,
} from 'store/slices/newSchemeSlice/types';
import { TypeParamsForm } from './TypeParamsForm';

export const AddFieldData: FC = () => {
  const dispatch = useTypedDispatch();

  const newSchemeFields = useTypedSelector(selectNewSchemeFields);
  const [newFieldName, setNewFieldName] = useState<string>('');
  const [newFieldType, setNewFieldType] = useState<SupportedFieldTypes | null>(
    null
  );
  const newSchemeName = useTypedSelector(selectNewSchemeName);

  const [newFieldParams, setNewFieldParams] = useState<FieldsParams | null>(
    null
  );

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
          {newSchemeName}
        </Title>
        <Text sx={{ color: '#A0A0A0' }}>создание поля в типе</Text>
      </Flex>
      <Box mb={30}>
        <Input.Wrapper
          label="Название поля"
          required
          styles={{
            label: {
              marginBottom: '10px',
              fontWeight: 400,
              fontSize: '16px',
            },
          }}
        >
          <Input
            value={newFieldName}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            onChange={(e) => {
              setNewFieldName(e.target.value);
            }}
            sx={{
              marginLeft: '0',
              fontSize: '16px',
              fontWeight: 500,
            }}
            placeholder="Назовите поле..."
          />
        </Input.Wrapper>
        <Select
          onChange={(value: SupportedFieldTypes) => {
            setNewFieldType(value);
          }}
          required
          label="Тип поля"
          mt="20px"
          styles={{
            label: {
              fontWeight: 400,
              fontSize: '16px',
              marginBottom: '10px',
            },
          }}
          placeholder="Выбрать"
          defaultValue="Текст"
          data={[
            { value: 'int', label: 'Целое число' },
            { value: 'text', label: 'Текст' },
            { value: 'bool', label: 'Отметка' },
            { value: 'real', label: 'Действительное число' },
            { value: 'datetime', label: 'Дата/время' },
          ]}
        />
        {newFieldType && (
          <TypeParamsForm type={newFieldType} onChange={setNewFieldParams} />
        )}
      </Box>
      <Flex sx={{ justifyContent: 'end' }} gap="16px">
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
            closeModal('createField');
          }}
        >
          Отменить
        </Button>
        <Button
          disabled={!(newFieldName && newFieldType)}
          onClick={() => {
            if (
              !newSchemeFields.find((field) => field.name === newFieldName) &&
              newFieldParams
            ) {
              dispatch(
                addFieldToNewScheme({
                  name: newFieldName,
                  required: newFieldParams?.required || false,
                  type: newFieldType || 'int',
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  params:
                    newFieldParams &&
                    Object.fromEntries(
                      Object.entries(newFieldParams).filter(
                        ([key]) => key !== 'required'
                      )
                    ),
                })
              );
              closeModal('createField');
            } else {
              showNotification({
                title: 'Предупреждение',
                message: 'Такое поле уже существует!',
                color: 'red',
              });
            }
          }}
          sx={{
            fontWeight: 400,
            borderRadius: '8px',
          }}
        >
          Добавить
        </Button>
      </Flex>
    </>
  );
};
