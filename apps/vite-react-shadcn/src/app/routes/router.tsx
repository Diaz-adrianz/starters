import {
  createBrowserRouter,
  Outlet,
  ScrollRestoration,
  type RouteObject,
} from 'react-router-dom';
import AuthLayout from './auth/auth.layout';
import authRoutes from './auth/auth.routes';
import GlobalLayout from './global/global.layout';
import globalRoutes from './global/global.routes';
import NotFoundPage from './not-found/not-found.page';

const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <>
        <ScrollRestoration getKey={(loc) => loc.key} />
        <Outlet />
      </>
    ),
    children: [
      {
        path: '',
        element: <GlobalLayout />,
        children: globalRoutes,
      },
      {
        path: 'auth',
        element: <AuthLayout />,
        children: authRoutes,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
];

const router: ReturnType<typeof createBrowserRouter> =
  createBrowserRouter(routes);

export { routes };
export default router;
