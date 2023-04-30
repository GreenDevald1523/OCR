import styled from '@emotion/styled';

interface TableBodyRowProps {
  selected: boolean;
}

export const StyledTableBodyRow = styled.tr((props: TableBodyRowProps) => ({
  backgroundColor: props.selected ? '#e4e9fd' : '#f9f9f9',
  borderBottom: '8px solid #ffffffff',
  cursor: 'pointer',

  '&:hover': {
    backgroundColor: props.selected
      ? '#e4e9fd !important'
      : '#F1F3F5 !important',
  },
  td: {
    borderBottom: 'none',
    padding: '11px 11px 11px 20px !important',

    div: {
      maxHeight: '50px',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  },

  ['td:first-of-type']: {
    borderRadius: '5px 0px 0px 5px',
  },
  ['td:last-child']: {
    borderRadius: '0px 5px 5px 0px',
  },
}));

export const StyledTableHeadRow = styled.tr`
  background-color: #f8f9ff;
  border-bottom: 8px solid #ffffffff;
  position: sticky;
  top: 0;

  &:hover {
    th {
      div {
        div:nth-of-type(2) {
          opacity: 1;
          background-color: #dee2e6;

          transition: opacity, background-color 0.2s ease;

          &:hover {
            background-color: #4c6ef5;
          }
        }
      }
    }
  }
`;
