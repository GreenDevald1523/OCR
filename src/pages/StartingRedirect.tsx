import { Navigate } from 'react-router-dom';
import { useTypedSelector } from 'store/ReduxHooks';
import { selectRefreshToken } from 'store/slices/authSlice';

export const StartingRedirect = () => {
  const refreshToken = useTypedSelector(selectRefreshToken);

  if (!refreshToken) return <Navigate to={'auth'} />;

  return <Navigate to={'home'} />;
};
