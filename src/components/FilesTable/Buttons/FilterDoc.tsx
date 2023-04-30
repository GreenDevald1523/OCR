import { FC, useMemo, useState } from 'react';
import {
  Popover,
  Button,
  Group,
  Title,
  CloseButton,
  Stack,
  Checkbox,
  Box,
  TextInput,
  ScrollArea,
  Flex,
  Text,
} from '@mantine/core';
import { ReactComponent as Columns } from '../../../assets/SVG/Columns.svg';
import { Table } from '@tanstack/react-table';
import { Document } from 'store/api/document/types';
import { DisableAble } from '.';

interface FilterButtonProps extends DisableAble {
  table: Table<Document>;
}

export const FilterDoc: FC<FilterButtonProps> = ({
  table,
  disabled = false,
}) => {
  const [filterPopoverOpened, setFilterPopoverOpened] = useState(false);

  const columns = table.getAllLeafColumns();

  const [filterInput, setFilterInput] = useState<string>('');

  const filteredColumns = useMemo(() => {
    return columns.filter((column) =>
      column.columnDef.header
        ?.toString()
        .toLowerCase()
        .includes(filterInput.toLowerCase())
    );
  }, [columns, filterInput]);

  const finalDisabled = disabled || table.getRowModel().rows.length === 0;

  const checkedColumns = columns.filter((column) => column.getIsVisible());

  return (
    <Popover
      width={370}
      opened={filterPopoverOpened}
      onChange={setFilterPopoverOpened}
      disabled={finalDisabled}
    >
      <Popover.Target>
        <Button
          onClick={() => setFilterPopoverOpened((o) => !o)}
          styles={() => ({
            root: {
              padding: '6px 22px 6px 20px',
              height: 35,
              fontSize: 16,
              fontWeight: 500,
              borderRadius: 8,
              color: '#1e1e1e',
              marginRight: '20px',

              '&:disabled': {
                backgroundColor: 'rgba(0,0,0,0)',
              },
            },

            leftIcon: {
              marginRight: 5,
            },
          })}
          leftIcon={
            <Columns
              width="18px"
              color={finalDisabled ? '#adb5bd' : '#1E1E1E'}
            />
          }
          variant="subtle"
          disabled={finalDisabled}
        >
          Столбцы таблицы
        </Button>
      </Popover.Target>
      <Popover.Dropdown
        sx={{
          borderRadius: '10px',
          marginLeft: '-32px',
        }}
      >
        <Group mb="12px" position="apart">
          <Title order={5}>Применяемые столбцы</Title>
          <CloseButton
            onClick={() => setFilterPopoverOpened((o) => !o)}
            title="Close popover"
            iconSize={16}
          />
        </Group>
        <TextInput
          mb={10}
          placeholder="Название столбца"
          value={filterInput}
          onChange={(e) => setFilterInput(e.target.value)}
          styles={(theme) => ({
            input: {
              fontSize: 14,
              height: 40,
            },
          })}
        />
        <ScrollArea style={{ height: 300 }}>
          <Stack spacing={5}>
            {filteredColumns.map((column) => {
              return (
                <Box key={column.id}>
                  <Checkbox
                    styles={() => ({
                      label: {
                        fontSize: 16,
                      },
                    })}
                    {...{
                      checked: column.getIsVisible(),
                      onChange: column.getToggleVisibilityHandler(),
                      label: column.columnDef.header as string,
                    }}
                  />
                </Box>
              );
            })}
          </Stack>
        </ScrollArea>
        <Group position="right" spacing="xs" mt="17px">
          <Flex mr="auto" direction="column" gap={3}>
            <Text size="xs">Выбрано колонок: {checkedColumns.length}</Text>
            <Text size="xs">Доступно колонок: {columns.length}</Text>
          </Flex>
          <Button
            styles={() => ({
              root: {
                padding: '3px 12px',
                height: 30,
                fontSize: 13,
                borderRadius: 8,
                fontWeight: 400,
                background: 'none',
                color: '#A0A0A0',
              },
            })}
            variant="subtle"
            onClick={() => setFilterPopoverOpened((o) => !o)}
          >
            Отмена
          </Button>
          <Button
            styles={() => ({
              root: {
                padding: '3px 12px',
                height: 30,
                fontSize: 13,
                fontWeight: 400,
                borderRadius: 8,
              },
            })}
            onClick={() => setFilterPopoverOpened((o) => !o)}
          >
            Сохранить
          </Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  );
};
