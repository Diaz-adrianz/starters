import type { RouteObject } from 'react-router-dom';
import HomePage from './home/home.page';

const globalRoutes: RouteObject[] = [
  {
    path: '',
    element: <HomePage />,
  },
];

export default globalRoutes;
