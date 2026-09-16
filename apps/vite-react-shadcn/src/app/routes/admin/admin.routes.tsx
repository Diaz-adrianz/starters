import type { RouteObject } from 'react-router-dom';
import AdminPage from './admin.page';

const adminRoutes: RouteObject[] = [
  {
    path: '',
    element: <AdminPage />,
  },
];

export default adminRoutes;
