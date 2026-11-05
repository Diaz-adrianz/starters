import type { RouteObject } from 'react-router-dom';
import SignInPage from './signin/signin.page';
import SignUpPage from './signup/signup.page';
import { AuthRoute } from '@/components/shared/auth';
import AcceptInvitePage from './accept-invite/accept-invite.page';
import ForgotPasswordPage from './forgot-password/forgot-password.page';

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
  {
    path: 'forgot-password',
    element: (
      <AuthRoute status="unauthenticated">
        <ForgotPasswordPage />
      </AuthRoute>
    ),
  },
  {
    path: 'accept-invite',
    element: <AcceptInvitePage />,
  },
];

export default authRoutes;
