import type { RouteObject } from 'react-router-dom';
import AdminPage from './admin.page';
import AccountsPage from './identity/accounts/accounts.page';
import RolesPage from './access/roles/roles.page';
import PermissionsPage from './access/permissions/permissions.page';
import RoleLayout from './access/roles/role/role.layout';
import RolePermissionsPage from './access/roles/role/permissions/role-permissions.page';
import RoleAccountsPage from './access/roles/role/accounts/role-accounts.page';
import RolePage from './access/roles/role/role.page';

const adminRoutes: RouteObject[] = [
  {
    path: '',
    element: <AdminPage />,
  },
  {
    path: 'identity',
    children: [{ path: 'accounts', element: <AccountsPage /> }],
  },
  {
    path: 'access',
    children: [
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
];

export default adminRoutes;
