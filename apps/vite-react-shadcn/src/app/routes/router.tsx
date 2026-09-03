import {
  createBrowserRouter,
  Outlet,
  ScrollRestoration,
  type RouteObject,
} from 'react-router-dom';
import AuthLayout from './auth/auth.layout';
import authRoutes from './auth/auth.routes';
import NotFoundPage from './not-found/not-found.page';
import HomeLayout from './home/home.layout';
import homeRoutes from './home/home.routes';

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
        element: <HomeLayout />,
        children: homeRoutes,
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
