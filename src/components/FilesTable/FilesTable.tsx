import { useMemo, useCallback } from 'react';
import { Table as MantineTable, Box, Loader, Text } from '@mantine/core';
import { flexRender, Row } from '@tanstack/react-table';
import * as S from '../../styles/Table';

import { DraggableColumnHeader } from './DraggableColumnHeader';
import { useFilesTable } from '../../hooks/useFilesTable';
import { FileTableContainer } from './FilesTableContainer';
import { Document } from 'store/api/document/types';
import { openModal } from '@mantine/modals';
import { useTypedDispatch, useTypedSelector } from 'store/ReduxHooks';
import {
  selectSelectedDocumentId,
  setSelectedDocumentId,
} from 'store/slices/currentDirectory';
import { DocumentPreview } from './Modals/DocumentPreview/DocumentPreview';
import { EmptyTable } from './EmptyTable/EmptyTable';
import { useGetClientUserQuery } from 'store/api/user/userApi';

export const FilesTable = () => {
  const dispatch = useTypedDispatch();
  const selectedId = useTypedSelector(selectSelectedDocumentId);
  const clientUser = useGetClientUserQuery({} as unknown as void, {
    refetchOnMountOrArgChange: true,
  });
  const { table, isLoading, filesData } = useFilesTable();

  const currentDocument = useMemo(
    () => filesData?.find((document) => document.id === selectedId),
    [selectedId, filesData]
  );

  const rowClickHandler = useCallback(
    (
      row: Row<Document>,
      event: React.MouseEvent<HTMLTableRowElement, MouseEvent>
    ) => {
      if (selectedId !== row.original.id)
        dispatch(setSelectedDocumentId(row.original.id));
      if (event.detail === 2) {
        if (currentDocument)
          openModal({
            centered: true,
            closeOnEscape: false,
            title: currentDocument.original_name.split('.')[0],
            children: <DocumentPreview document={currentDocument} />,
            styles: { modal: { width: '666px !important' } },
          });
      }
    },
    [currentDocument, dispatch, selectedId]
  );

  const isTableEmpty = table && table.getRowModel().rows.length === 0;

  if (isLoading)
    return (
      <Box m="auto">
        <Loader />
      </Box>
    );

  return (
    <>
      {table && (
        <FileTableContainer
          table={table}
          selectedId={selectedId}
          currentDocument={currentDocument}
        >
          {isTableEmpty ? (
            <EmptyTable isSuperUser={!!clientUser?.currentData?.superuser} />
          ) : (
            <MantineTable sx={{ position: 'relative' }}>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <S.StyledTableHeadRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <DraggableColumnHeader
                        key={header.id}
                        header={header}
                        table={table}
                      />
                    ))}
                  </S.StyledTableHeadRow>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <S.StyledTableBodyRow
                    key={row.id}
                    onClick={(e) => rowClickHandler(row, e)}
                    selected={selectedId === row.original.id}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        <Text w={cell.column.getSize()}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Text>
                      </td>
                    ))}
                  </S.StyledTableBodyRow>
                ))}
              </tbody>
            </MantineTable>
          )}
        </FileTableContainer>
      )}
    </>
  );
};
