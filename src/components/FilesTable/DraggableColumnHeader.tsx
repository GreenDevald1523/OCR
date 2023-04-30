import { Center, Flex, Text, ActionIcon, Box } from '@mantine/core';
import {
  Column,
  ColumnOrderState,
  flexRender,
  Header,
  Table,
} from '@tanstack/react-table';

import { FC } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { IconArrowsSort } from '@tabler/icons';
import { ReactComponent as Sort } from 'assets/SVG/Sort.svg';
import { Document, Fields } from 'store/api/document/types';

const reorderColumn = (
  draggedColumnId: string,
  targetColumnId: string,
  columnOrder: string[]
): ColumnOrderState => {
  columnOrder.splice(
    columnOrder.indexOf(targetColumnId),
    0,
    columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string
  );
  return [...columnOrder];
};

export const DraggableColumnHeader: FC<{
  header: Header<Document, unknown>;
  table: Table<Document>;
}> = ({ header, table }) => {
  const { getState, setColumnOrder } = table;
  const TableState = getState();
  const { column } = header;

  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: 'column',
    drop: (draggedColumn: Column<Fields>) => {
      const newColumnOrder = reorderColumn(
        draggedColumn.id,
        column.id,
        TableState.columnOrder
      );
      setColumnOrder(newColumnOrder);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => column,
    type: 'column',
  });

  return (
    <th
      ref={dropRef}
      colSpan={header.colSpan}
      style={{
        opacity: isDragging ? 0.8 : 1,
        MozWindowDragging: 'no-drag',
        width: header.getSize(),
        minWidth: 100,
      }}
    >
      <Center
        sx={(theme) => ({
          padding: '0 8px',
          width: '100%',
          borderRadius: 5,
          transition: isOver && canDrop ? 'background-color 0.2s ease' : '',
          backgroundColor: isOver && canDrop ? theme.colors.dark[1] : '',
          position: 'relative',
          userSelect: 'none',
          touchAction: 'none',
        })}
        inline
        ref={previewRef}
      >
        <Flex
          ref={dragRef}
          align="center"
          sx={{
            height: '33.7px',
            cursor: 'move',
            width: header.getSize() - 15,
          }}
        >
          {header.isPlaceholder ? null : (
            <Text
              sx={(theme) => ({
                color: isOver && canDrop ? theme.colors.gray[0] : '',
                userSelect: 'none',
                MozWindowDragging: 'no-drag',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              })}
              fw={400}
              fz={14}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </Text>
          )}
          <ActionIcon
            color="indigo"
            variant="transparent"
            onClick={column.getToggleSortingHandler()}
            sx={() => ({
              transform: column.getIsSorted() === 'asc' ? 'rotate(180deg)' : '',
              width: '14px',
              transition: 'all 0.2s ease',
            })}
          >
            {column.getIsSorted() ? (
              <Sort width="14px" />
            ) : (
              <IconArrowsSort size={14} />
            )}
          </ActionIcon>
        </Flex>
        <Box
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          sx={() => ({
            width: '6px',
            height: '20px',
            borderRadius: 3,
            cursor: 'col-resize',
            marginLeft: 'auto',

            transform: header.column.getIsResizing()
              ? `translateX(${
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  table.getState().columnSizingInfo.deltaOffset!
                }px)`
              : '',
          })}
          style={{ zIndex: '10' }}
        ></Box>
      </Center>
    </th>
  );
};
