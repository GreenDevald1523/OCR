/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Text } from '@mantine/core';
import { ColumnDef } from '@tanstack/react-table';
import { Document, Scheme } from 'store/api/document/types';
import { compareTwoRowValues } from './CompareTwoRowValues';
import { getDocumentValueFromTableRow } from './getDocumentValueFromTableRow';
import { IconCheck, IconPlus } from '@tabler/icons';
import { Directory } from 'store/api/directory/types';
import DateTimeCell from 'components/FilesTable/Cells/DateTimeCell';

type TschemeField = {
  id: number;
  name: string;
  local_index: number;
  value: string;
  subtype?: 'datetime' | 'time' | 'date';
};

export const generateDefaultColumns = (
  documents: Document[] | undefined,
  schemes: Record<number, Scheme> | undefined,
  directories: Directory[] | undefined
): ColumnDef<Document>[] => {
  if (!documents || !documents.length || !directories || !directories.length)
    return [] as ColumnDef<Document>[];

  const result: ColumnDef<Document>[] = [
    {
      accessorKey: 'id',
      id: 'id',
      cell: (info) => info.getValue(),
      header: 'ID',
    },
    {
      accessorKey: 'createdate',
      id: 'createdate',
      //@ts-ignore
      cell: (info: CellContext<Document, string>) =>
        info.getValue() ? new Date(info.getValue()).toLocaleString('ru') : null,
      header: 'Дата создания',
    },
    {
      accessorKey: 'modifydate',
      id: 'modifydate',
      //@ts-ignore
      cell: (info: CellContext<Document, string>) =>
        info.getValue() ? new Date(info.getValue()).toLocaleString('ru') : null,
      header: 'Последнее изменение',
    },
    {
      accessorKey: 'scheme',
      id: 'scheme',
      cell: (info) => {
        for (const [key, value] of Object.entries(schemes || {})) {
          if (parseInt(key) === info.getValue()) {
            return <Text>{value.title}</Text>;
          }
        }
      },
      header: 'Схема',
    },
    {
      accessorKey: 'original_name',
      id: 'original_name',
      //@ts-ignore
      cell: (info: CellContext<Document, string>) => {
        const type: string = info.getValue();
        const res = type.slice(type.lastIndexOf('.') + 1, type.length);
        return <Text>{res.toUpperCase()}</Text>;
      },
      header: 'Тип файла',
    },
    {
      accessorKey: 'directory',
      id: 'directory',
      cell: (info) => {
        for (let i = 0; i < directories.length; i++) {
          if (directories[i].id === info.getValue()) {
            return <Text>{directories[i].title}</Text>;
          }
        }
      },
      header: 'Папка',
    },
  ];

  for (let i = 0; i < documents?.length; i++) {
    // я вообще без понятия как это чудовище правильно типизировать
    for (const [key, value] of Object.entries((documents || [])[i].fields)) {
      value.forEach((schemeField: TschemeField) => {
        if (!result.find((column) => column.header === schemeField.name)) {
          result.push({
            accessorKey: schemeField.name,
            id: schemeField.id.toString(),
            header: schemeField.name,
            sortingFn: (rowA, rowB) =>
              compareTwoRowValues(rowA, rowB, key, schemeField.name),
            // @ts-ignore
            cell: (info: CellContext<Document, string>) => {
              const content = getDocumentValueFromTableRow(
                info.cell.row,
                key,
                schemeField.name
              );
              return (
                <>
                  {typeof content === 'boolean' ? (
                    content === true ? (
                      <IconCheck />
                    ) : (
                      <IconPlus style={{ transform: 'rotate(45deg)' }} />
                    )
                  ) : schemeField.subtype ? (
                    <DateTimeCell
                      subtype={schemeField.subtype}
                      value={schemeField.value}
                    />
                  ) : (
                    <Text
                      align={key.slice(0, 4) === 'text' ? 'center' : 'left'}
                    >
                      {content}
                    </Text>
                  )}
                </>
              );
            },
            minSize: 75,
          });
        }
      });
    }
  }
  return result;
};
