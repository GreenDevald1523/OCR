import { AppShell } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { SideRegisterArt } from '../SideRegisterArt/SideRegisterArt';
import { useMediaQuery } from '@mantine/hooks';

export const SignupLayout = () => {
  const largeScreen = useMediaQuery('(min-width: 900px)');

  return (
    <AppShell
      navbar={largeScreen ? <SideRegisterArt /> : undefined}
      styles={() => ({
        main: {
          width: '60vw',
          backgroundColor: '#fff',
          padding: '0',
          position: 'relative',
          overflow: 'hidden',
        },
        navbar: {
          width: '40vw',
          backgroundColor: '#000',
        },
      })}
    >
      <Outlet />
    </AppShell>
  );
};
