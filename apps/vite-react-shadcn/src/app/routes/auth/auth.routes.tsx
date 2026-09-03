import type { RouteObject } from 'react-router-dom';
import SignInPage from './signin/signin.page';
import SignUpPage from './signup/signup.page';

const authRoutes: RouteObject[] = [
  {
    path: 'signin',
    element: <SignInPage />,
  },
  {
    path: 'signup',
    element: <SignUpPage />,
  },
];

export default authRoutes;
