/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Row } from '@tanstack/react-table';
import { Document, DocumentFields } from 'store/api/document/types';

export const getDocumentValueFromTableRow = (
  row: Row<Document>,
  key: string,
  name: string
) =>
  // TS тут ругается на метод find, мол DocumentFields имеют разные сигнатуры и мол так не надо делать,
  // но лично мне поебать 😎 (ну а ещё мы же по индексу ищем, а он в каждом объекте есть, так что
  // можно не переживать)
  // @ts-ignore
  row.original.fields[key.replace('_scheme', '') as keyof DocumentFields]?.find(
    (fileFiled: { index: number; name: string }) => name === fileFiled.name
  )?.value;
