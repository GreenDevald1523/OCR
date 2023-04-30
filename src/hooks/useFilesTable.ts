import { useState, useEffect, useMemo } from 'react';

import {
  ColumnDef,
  ColumnOrderState,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { selectCurrentDirectoryId } from 'store/slices/currentDirectory';
import { useGetAllDirectoriesQuery } from 'store/api/directory';
import {
  useGetAllDocumentsByDirectoryIdQuery,
  useGetSuperSchemesQuery,
} from 'store/api/document';
import { useTypedSelector } from 'store/ReduxHooks';

import { generateDefaultColumns } from '../utils/generateDefaultColumns';
import { Document } from 'store/api/document/types';

export const useFilesTable = () => {
  const currentDirectoryId = useTypedSelector(selectCurrentDirectoryId);
  const getAllDirectories = useGetAllDirectoriesQuery();

  const allDocumentsBySelectedId =
    useGetAllDocumentsByDirectoryIdQuery(currentDirectoryId);
  const schemas = useMemo(
    () =>
      allDocumentsBySelectedId.isSuccess && allDocumentsBySelectedId.data
        ? Array.from(
            new Set(
              allDocumentsBySelectedId.data.map((elem) => elem.scheme).sort()
            )
          )
        : [],
    [allDocumentsBySelectedId.data, allDocumentsBySelectedId.isSuccess]
  );

  const superSchemes = useGetSuperSchemesQuery(schemas);
  const defaultColumns = useMemo(() => {
    return generateDefaultColumns(
      allDocumentsBySelectedId.data || [],
      superSchemes.data?.schemes,
      getAllDirectories.data
    );
  }, [allDocumentsBySelectedId.data, superSchemes, getAllDirectories.data]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columns, setColumns] = useState(defaultColumns);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);

  useEffect(() => {
    setColumns(defaultColumns);
  }, [defaultColumns]);

  useEffect(() => {
    setColumnOrder(
      columns.map((column) => {
        return column.id as string;
      })
    );
  }, [columns]);

  const isTableReady = !!(allDocumentsBySelectedId.data && columns);

  const table = useReactTable({
    data: allDocumentsBySelectedId.data ?? [],
    columns: (columns as ColumnDef<Document, any>[]) ?? [],
    state: {
      columnOrder,
      sorting,
      columnVisibility,
    },
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: 'onEnd',
  });

  return {
    filesData: allDocumentsBySelectedId.data,
    isLoading:
      allDocumentsBySelectedId.isLoading ||
      superSchemes.isLoading ||
      superSchemes.isFetching ||
      allDocumentsBySelectedId.isFetching,
    table: isTableReady ? table : null,
  };
};
