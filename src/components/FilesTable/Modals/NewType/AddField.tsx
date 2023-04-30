import { Box, Button, Flex, Group, Text, Title } from '@mantine/core';
import { closeModal, openModal } from '@mantine/modals';
import { useTypedDispatch, useTypedSelector } from 'store/ReduxHooks';
import { AddFieldData } from './AddFieldData';
import {
  selectNewSchemeName,
  selectNewSchemeFields,
  clearNewScheme,
} from 'store/slices/newSchemeSlice/newSchemeSlice';
import { IconPlus } from '@tabler/icons';
import { TypesMap } from 'store/slices/newSchemeSlice/types';
import { createSchemeFromAddSchemeForm } from '../../../../utils/createSchemeFromAddSchemeForm';
import { useCreateSchemeMutation } from 'store/api/document';

export const AddField = () => {
  const dispatch = useTypedDispatch();

  const newSchemeName = useTypedSelector(selectNewSchemeName);

  const currentFieldsData = useTypedSelector(selectNewSchemeFields);

  const [sendNewScheme] = useCreateSchemeMutation();

  return (
    <Box sx={{ boxSizing: 'border-box' }}>
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
        <Text sx={{ color: '#A0A0A0' }}>создание типа документа</Text>
      </Flex>

      <Button
        sx={{
          fontSize: '17px',
          fontWeight: 400,
          height: '38px',
          width: '225px',
          borderRadius: '10px',
          position: 'relative',
          bottom: '25px',
        }}
        color="dark"
        leftIcon={<IconPlus size={16} />}
        onClick={() => {
          openModal({
            modalId: 'createField',
            closeOnEscape: false,
            centered: true,
            children: <AddFieldData />,
          });
        }}
      >
        Добавить поле
      </Button>
      {currentFieldsData.map((item) => (
        <Flex
          sx={{
            fontSize: '16px',
            height: '51px',
            borderRadius: '11px',
            alignItems: 'center',
            paddingInline: '16px',
            justifyContent: 'space-between',
          }}
          bg="#E9ECEF"
          key={item.name}
          mb="10px"
        >
          <Box
            sx={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
            w="500px"
          >
            {item.name}
          </Box>
          <Box
            sx={{
              borderRadius: '0px 11px 11px 0px;',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
            w="132px"
            bg="#DEE2E6"
            p="13px"
            mr="-16px"
          >
            {TypesMap[item.type as keyof typeof TypesMap]}
          </Box>
        </Flex>
      ))}
      <Group position="right" mt={30}>
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
          onClick={async () => {
            dispatch(clearNewScheme());
            closeModal('addField');
          }}
        >
          Отменить
        </Button>
        <Button
          sx={{
            fontWeight: 400,
            borderRadius: '8px',
          }}
          onClick={async () => {
            await sendNewScheme(
              createSchemeFromAddSchemeForm(newSchemeName, currentFieldsData)
            );
            dispatch(clearNewScheme());
            closeModal('addField');
            closeModal('addNewType');
          }}
        >
          Сохранить
        </Button>
      </Group>
    </Box>
  );
};
