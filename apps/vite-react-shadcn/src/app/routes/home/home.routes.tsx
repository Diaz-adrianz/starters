import type { RouteObject } from 'react-router-dom';
import HomePage from './index/index.page';
import ProfilePage from './profile/profile.page';

const homeRoutes: RouteObject[] = [
  {
    path: '',
    element: <HomePage />,
  },
  {
    path: 'profile',
    element: <ProfilePage />,
  },
];

export default homeRoutes;
