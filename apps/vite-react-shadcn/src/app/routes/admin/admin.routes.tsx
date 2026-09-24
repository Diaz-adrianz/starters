import type { RouteObject } from 'react-router-dom';
import AdminPage from './admin.page';
import AccountsPage from './identity/accounts/accounts.page';
import RolesPage from './access/roles/roles.page';
import PermissionsPage from './access/permissions/permissions.page';
import PagesPage from './access/pages/pages.page';
import ProfilesPage from './identity/profiles/profiles.page';

const adminRoutes: RouteObject[] = [
  {
    path: '',
    element: <AdminPage />,
  },
  {
    path: 'identity',
    children: [
      { path: 'accounts', element: <AccountsPage /> },
      { path: 'profiles', element: <ProfilesPage /> },
    ],
  },
  {
    path: 'access',
    children: [
      { path: 'roles', element: <RolesPage /> },
      { path: 'permissions', element: <PermissionsPage /> },
      { path: 'pages', element: <PagesPage /> },
    ],
  },
];

export default adminRoutes;
