import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { router } from '../../router';
import { store } from 'store/store';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { CustomFonts } from '../CustomFonts/CustomFonts';
import { CustomTheme } from '../../styles/theme';

function App() {
  return (
    <Provider store={store}>
      <MantineProvider theme={CustomTheme} withGlobalStyles withNormalizeCSS>
        <ModalsProvider>
          <NotificationsProvider>
            <CustomFonts />
            <RouterProvider router={router} />
          </NotificationsProvider>
        </ModalsProvider>
      </MantineProvider>
    </Provider>
  );
}

export default App;
