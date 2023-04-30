import { Button, Flex } from '@mantine/core';
import Select from 'react-select';
import { SmartImportDropZone } from './SmartImportDropzone';
import { Option } from '../Option';
import { closeAllModals, openModal } from '@mantine/modals';
import { useModalTypesAndFields } from '../../../../hooks/useModalSchemesAndFields';
import { useTypedDispatch, useTypedSelector } from 'store/ReduxHooks';
import {
  selectCurrentTypeName,
  setCurrentTypeName,
} from 'store/slices/currentType';
import { showNotification } from '@mantine/notifications';

export const SelectOcrScheme = () => {
  const { schemesOcr } = useModalTypesAndFields();
  const dispatch = useTypedDispatch();
  const chosenTypeName = useTypedSelector(selectCurrentTypeName);

  return (
    <>
      <Select
        placeholder="Выбрать схему"
        options={schemesOcr}
        components={{ Option }}
        onChange={(e) => dispatch(setCurrentTypeName(e!.value))}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: '#b2d3fe',
          },
        })}
      />
      <Flex sx={{ justifyContent: 'end' }} mt="20px" gap="16px">
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
            closeAllModals();
            dispatch(setCurrentTypeName(''));
          }}
        >
          Отменить
        </Button>
        <Button
          onClick={() => {
            if (chosenTypeName) {
              openModal({
                modalId: 'selectOcrScheme',
                centered: true,
                closeOnEscape: false,
                children: <SmartImportDropZone />,
                styles: {
                  modal: {
                    width: '880px !important',
                  },
                },
              });
            } else {
              showNotification({
                title: 'Предупреждение',
                message: 'Выберете тип!',
                color: 'red',
              });
            }
          }}
          sx={{
            fontWeight: 400,
            borderRadius: '8px',
          }}
        >
          Выбрать
        </Button>
      </Flex>
    </>
  );
};
