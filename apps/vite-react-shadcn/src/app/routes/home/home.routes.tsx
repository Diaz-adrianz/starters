import type { RouteObject } from 'react-router-dom';
import HomePage from './index/index.page';

const homeRoutes: RouteObject[] = [
  {
    path: '',
    element: <HomePage />,
  },
];

export default homeRoutes;
