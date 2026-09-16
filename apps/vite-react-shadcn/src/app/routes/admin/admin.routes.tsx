import type { RouteObject } from 'react-router-dom';
import AdminPage from './admin.page';
import AccountsPage from './iam/accounts/accounts.page';
import RolesPage from './iam/roles/roles.page';
import PermissionsPage from './iam/permissions/permissions.page';
import PagesPage from './iam/pages/pages.page';

const adminRoutes: RouteObject[] = [
  {
    path: '',
    element: <AdminPage />,
  },
  {
    path: 'iam',
    children: [
      { path: 'accounts', element: <AccountsPage /> },
      { path: 'roles', element: <RolesPage /> },
      { path: 'permissions', element: <PermissionsPage /> },
      { path: 'pages', element: <PagesPage /> },
    ],
  },
];

export default adminRoutes;
