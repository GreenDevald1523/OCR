import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';
import { showNotification } from '@mantine/notifications';
import { getErrorMessageFromErrorsMap } from '../../utils/NetworkErrorsMap';

/**
 * Если у нас какая то ошибка нетворка - выводим уведомление об этом
 */
export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (
    isRejectedWithValue(action) &&
    action.meta.arg.endpointName !== 'getClientUser'
  ) {
    showNotification({
      title: `Ошибка ${action.payload.status} ⚠️`,
      message: getErrorMessageFromErrorsMap(
        action.meta.arg.endpointName,
        action.payload.status,
        action.payload.data.detail
      ),
      color: 'red',
    });
  }

  return next(action);
};
