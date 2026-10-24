import type { RouteObject } from 'react-router-dom';
import SignInPage from './signin/signin.page';
import SignUpPage from './signup/signup.page';
import { AuthRoute } from '@/components/shared/auth';

const authRoutes: RouteObject[] = [
  {
    path: 'signin',
    element: (
      <AuthRoute status="unauthenticated">
        <SignInPage />
      </AuthRoute>
    ),
  },
  {
    path: 'signup',
    element: (
      <AuthRoute status="unauthenticated">
        <SignUpPage />
      </AuthRoute>
    ),
  },
];

export default authRoutes;
