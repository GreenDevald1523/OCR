import Select from 'react-select';
import { Option } from './Option';
import { useModalTypesAndFields } from '../../../hooks/useModalSchemesAndFields';
import {
  selectCurrentTypeName,
  setCurrentTypeName,
} from 'store/slices/currentType';
import { useTypedDispatch, useTypedSelector } from 'store/ReduxHooks';
import { closeModal, openModal } from '@mantine/modals';
import { Group, Button, Styles, ModalStylesParams } from '@mantine/core';
import { AddDocument } from './ExistingType/AddDocument';
import { showNotification } from '@mantine/notifications';

export const SelectScheme = ({
  nextStep = () => <AddDocument />,
  styles,
}: {
  nextStep?: () => React.ReactNode;
  styles?:
    | Styles<
        | 'body'
        | 'header'
        | 'title'
        | 'root'
        | 'inner'
        | 'overlay'
        | 'modal'
        | 'close',
        ModalStylesParams
      >
    | undefined;
}) => {
  const { schemesAll } = useModalTypesAndFields();
  const dispatch = useTypedDispatch();
  const chosenTypeName = useTypedSelector(selectCurrentTypeName);

  return (
    <>
      <Select
        isSearchable={false}
        placeholder="Выбрать схему"
        options={schemesAll}
        components={{ Option }}
        onChange={(e) => {
          if (e && e.value) {
            dispatch(setCurrentTypeName(e.value));
          }
        }}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: '#b2d3fe',
          },
        })}
      />
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
          onClick={() => {
            closeModal('createType');
            dispatch(setCurrentTypeName(''));
          }}
        >
          Отменить
        </Button>
        <Button
          sx={{
            fontWeight: 400,
            borderRadius: '8px',
          }}
          onClick={() => {
            if (chosenTypeName) {
              openModal({
                styles: styles ?? {
                  modal: {
                    width: '600px',
                  },
                },
                modalId: 'addDocument',
                centered: true,
                closeOnEscape: false,
                children: nextStep(),
                onClose: () => {
                  dispatch(setCurrentTypeName(''));
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
        >
          Создать
        </Button>
      </Group>
    </>
  );
};
