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
import AccountLayout from './account/account.layout';
import AccountPage from './account/account.page';
import AccountProfilePage from './account/profile/account-profile.page';
import AccountSessionsPage from './account/sessions/account-sessions.page';
import AccountActivitiesPage from './account/activities/account-activities.page';

const adminRoutes: RouteObject[] = [
  {
    path: '',
    element: <AdminPage />,
  },
  {
    path: 'iam',
    children: [
      { path: 'accounts', element: <AccountsPage /> },
      {
        path: 'accounts/:id',
        element: <AccountLayout />,
        children: [
          { path: '', element: <AccountPage /> },
          { path: 'profile', element: <AccountProfilePage /> },
          { path: 'sessions', element: <AccountSessionsPage /> },
          { path: 'activities', element: <AccountActivitiesPage /> },
        ],
      },
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
