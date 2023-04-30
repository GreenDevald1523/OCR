import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from 'react-router-dom';
import { PrivateRoute } from 'components/PrivateRoute/PrivateRoute';
import { AppLayout } from 'components/AppLayout/AppLayout';
import { SignupLayout } from 'components/SignupLayout/SignupLayout';

import { StartingRedirect } from 'pages/StartingRedirect';
import { AccessRightsLayout } from 'pages/AcсessRights/AcessRightsLayout';

const Auth = lazy(() => import('./pages/Auth'));
const HomePage = lazy(() => import('./pages/HomePage'));
const Register = lazy(() => import('./pages/Register'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));
const ManageRights = lazy(
  () => import('./pages/AcсessRights/ManageRights/ManageRights')
);
const CreateRoles = lazy(
  () => import('./pages/AcсessRights/CreateRoles/CreateRoles')
);

const ApproveUsers = lazy(
  () => import('./pages/AcсessRights/ApproveUsers/ApproveUsers')
);

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="" element={<StartingRedirect />} />
      <Route path="/" element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          <Route
            errorElement={<>Произошла ошибка, скоро всё починим</>}
            path="home"
            element={
              <Suspense>
                <HomePage />
              </Suspense>
            }
          />
          <Route path="access_rights" element={<AccessRightsLayout />}>
            <Route
              path="manage"
              element={
                <Suspense>
                  <ManageRights />
                </Suspense>
              }
            />
            <Route
              path="add"
              element={
                <Suspense>
                  <CreateRoles />
                </Suspense>
              }
            />
            <Route
              path="approve"
              element={
                <Suspense>
                  <ApproveUsers />
                </Suspense>
              }
            />
            <Route path="" element={<Navigate to="manage" replace />} />
          </Route>
        </Route>
      </Route>
      <Route path="/" element={<SignupLayout />}>
        <Route
          path="register"
          element={
            <Suspense>
              <Register />
            </Suspense>
          }
        />
        <Route
          path="auth"
          element={
            <Suspense fallback={'Загрузка...'}>
              <Auth />
            </Suspense>
          }
        />
        <Route
          path="change_password"
          element={
            <Suspense fallback={'Загрузка...'}>
              <ChangePassword />
            </Suspense>
          }
        />
      </Route>
      <Route path="*" element={<>Никого нет в доме под номером 404</>} />
    </>
  )
);
