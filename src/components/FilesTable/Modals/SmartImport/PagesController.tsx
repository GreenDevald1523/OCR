import { Box, Pagination } from '@mantine/core';
import React, { FC } from 'react';
import '@fontsource/open-sans';

export interface Pages {
  activePage: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  amountOfPages: number;
}

export const PagesController: FC<Pages> = ({
  activePage,
  setPage,
  amountOfPages,
}) => {
  return (
    <Box
      sx={{
        background: 'white',
        borderRadius: '13px',
        boxSizing: 'border-box',
        padding: '15px',
        left: 0,
      }}
    >
      <Pagination
        page={activePage}
        onChange={setPage}
        total={amountOfPages}
        sx={{
          justifyContent: 'center',
          flexWrap: 'nowrap',
        }}
        styles={{
          item: {
            fontFamily: 'Open Sans !important',
            color: '#495057',
            background: '#F1F3F5',
            border: '1px solid #F1F3F5',
            fontWeight: 700,
            fontSize: '12px',
            borderRadius: '10px',
          },
        }}
      />
    </Box>
  );
};
