import { Box, Flex } from '@mantine/core';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SideMenu } from '../SideMenu/SideMenu';
import { Outlet } from 'react-router-dom';
import { getBackendOptions } from '@minoru/react-dnd-treeview';

export const AppLayout = () => {
  return (
    <>
      <Box
        sx={(theme) => ({
          backgroundColor: theme.colors.indigo[6],
          height: '7vh',
          width: '100vw',
        })}
      />
      <Flex sx={{ width: '100vw', maxHeight: '93vh' }}>
        <DndProvider backend={HTML5Backend} options={getBackendOptions()}>
          <SideMenu />
          <Outlet />
        </DndProvider>
      </Flex>
    </>
  );
};
