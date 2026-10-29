import type { RouteObject } from 'react-router-dom';
import AdminPage from './admin.page';
import AccountsPage from './accounts/accounts.page';
import RolesPage from './roles/roles.page';
import PermissionsPage from './permissions/permissions.page';
import RoleLayout from './role/role.layout';
import RolePermissionsPage from './role/permissions/role-permissions.page';
import RoleAccountsPage from './role/accounts/role-accounts.page';
import RolePage from './role/role.page';
import { ActivitiesPage } from './activities/activities.page';

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
      {
        path: 'roles/:id',
        element: <RoleLayout />,
        children: [
          { path: '', element: <RolePage /> },
          { path: 'accounts', element: <RoleAccountsPage /> },
          { path: 'permissions', element: <RolePermissionsPage /> },
        ],
      },
      { path: 'permissions', element: <PermissionsPage /> },
    ],
  },
  {
    path: 'system',
    children: [
      {
        path: 'activities',
        element: <ActivitiesPage />,
      },
    ],
  },
];

export default adminRoutes;
