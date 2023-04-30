import { FC, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useTypedDispatch, useTypedSelector } from 'store/ReduxHooks';
import { selectRefreshToken, setIsAllowed } from 'store/slices/authSlice';
import { useGetClientUserQuery } from 'store/api/user/userApi';
import { showNotification } from '@mantine/notifications';

export const PrivateRoute: FC = () => {
  const refreshToken = useTypedSelector(selectRefreshToken);
  const dispatch = useTypedDispatch();
  const navigate = useNavigate();
  const ClientUser = useGetClientUserQuery();

  useEffect(() => {
    if (
      ClientUser.currentData &&
      !ClientUser.currentData.allowed &&
      !ClientUser.isLoading
    ) {
      const isSuperUser = !!ClientUser.currentData?.superuser;
      dispatch(setIsAllowed(ClientUser.currentData.allowed));
      if (!isSuperUser) {
        showNotification({
          message:
            'Ваш аккаунт еще не подтвержден. Свяжитесь с администратором системы для подтверждения',
        });

        navigate('auth', { replace: true });
        return;
      }
      navigate('change_password', { replace: true });
    }
  }, [ClientUser.currentData, ClientUser.isLoading, dispatch, navigate]);

  return !refreshToken ? <Navigate to="/auth" /> : <Outlet />;
};
