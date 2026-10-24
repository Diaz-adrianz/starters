import type { RouteObject } from 'react-router-dom';
import ProfilePage from './profile/profile.page';
import ProfileLayout from './profile/profile.layout';
import AccountsPage from './profile/accounts/accounts.page';
import SessionsPage from './profile/sessions/sessions.page';
import SettingsLayout from './settings/settings.layout';
import SettingsPage from './settings/settings.page';
import NotificationsPage from './notifications/notifications.page';
import HomePage from './home.page';
import { AuthRoute } from '@/components/shared/auth';

const homeRoutes: RouteObject[] = [
  {
    path: '',
    element: <HomePage />,
  },
  {
    path: 'profile',
    element: (
      <AuthRoute>
        <ProfileLayout />
      </AuthRoute>
    ),
    children: [
      {
        path: '',
        element: <ProfilePage />,
      },
      {
        path: 'accounts',
        element: <AccountsPage />,
      },
      {
        path: 'sessions',
        element: <SessionsPage />,
      },
    ],
  },
  {
    path: 'settings',
    element: (
      <AuthRoute>
        <SettingsLayout />
      </AuthRoute>
    ),
    children: [
      {
        path: '',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: 'notifications',
    element: (
      <AuthRoute>
        <NotificationsPage />
      </AuthRoute>
    ),
  },
];

export default homeRoutes;
