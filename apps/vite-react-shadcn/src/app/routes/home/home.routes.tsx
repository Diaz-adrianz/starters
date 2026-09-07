import type { RouteObject } from 'react-router-dom';
import HomePage from './index/index.page';
import ProfilePage from './profile/profile.page';
import { AuthenticatedRoute } from '@/components/shared/authenticated-route';
import ProfileLayout from './profile/profile.layout';

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
    ],
  },
];

export default homeRoutes;
