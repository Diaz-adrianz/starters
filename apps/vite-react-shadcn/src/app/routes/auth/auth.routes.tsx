import type { RouteObject } from 'react-router-dom';
import SignInPage from './signin/signin.page';
import SignUpPage from './signup/signup.page';
import { UnauthenticatedRoute } from '@/components/shared/unauthenticated-route';

const authRoutes: RouteObject[] = [
  {
    path: 'signin',
    element: (
      <UnauthenticatedRoute>
        <SignInPage />
      </UnauthenticatedRoute>
    ),
  },
  {
    path: 'signup',
    element: (
      <UnauthenticatedRoute>
        <SignUpPage />
      </UnauthenticatedRoute>
    ),
  },
];

export default authRoutes;
