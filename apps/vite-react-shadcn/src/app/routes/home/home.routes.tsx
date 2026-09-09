import type { RouteObject } from 'react-router-dom';
import HomePage from './index/index.page';
import ProfilePage from './profile/profile.page';
import { AuthenticatedRoute } from '@/components/shared/authenticated-route';
import ProfileLayout from './profile/profile.layout';
import AccountsPage from './profile/accounts/accounts.page';
import SessionsPage from './profile/sessions/sessions.page';
import SettingsLayout from './settings/settings.layout';
import SettingsPage from './settings/settings.page';
import NotificationsPage from './notifications/notifications.page';

const homeRoutes: RouteObject[] = [
  {
    path: '',
    element: <HomePage />,
  },
  {
    path: 'profile',
    element: (
      <AuthenticatedRoute>
        <ProfileLayout />
      </AuthenticatedRoute>
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
      <AuthenticatedRoute>
        <SettingsLayout />
      </AuthenticatedRoute>
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
      <AuthenticatedRoute>
        <NotificationsPage />
      </AuthenticatedRoute>
    ),
  },
];

export default homeRoutes;
