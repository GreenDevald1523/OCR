import { Row } from '@tanstack/react-table';
import { Document } from 'store/api/document/types';
import { getDocumentValueFromTableRow } from './getDocumentValueFromTableRow';

export const compareTwoRowValues = (
  rowA: Row<Document>,
  rowB: Row<Document>,
  key: string,
  name: string
) => {
  const valueA = getDocumentValueFromTableRow(rowA, key, name);
  const valueB = getDocumentValueFromTableRow(rowB, key, name);

  if (!valueA && !valueB) return 0;
  if (!valueB) return 1;
  if (!valueA) return -1;

  if (valueA > valueB) return 1;
  if (valueA < valueB) return -1;
  return 0;
};
