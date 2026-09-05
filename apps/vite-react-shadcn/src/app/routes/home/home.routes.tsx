import type { RouteObject } from 'react-router-dom';
import HomePage from './index/index.page';
import ProfilePage from './profile/profile.page';
import { AuthenticatedRoute } from '@/components/shared/authenticated-route';

const homeRoutes: RouteObject[] = [
  {
    path: '',
    element: <HomePage />,
  },
  {
    path: 'profile',
    element: (
      <AuthenticatedRoute>
        <ProfilePage />
      </AuthenticatedRoute>
    ),
  },
];

export default homeRoutes;
