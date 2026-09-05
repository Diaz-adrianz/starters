import authStore from '@/stores/auth.store';
import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

type Props = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const authStatus = authStore((s) => s.status);

  if (authStatus === 'unauthenticated') return <Navigate to={'/auth/signin'} />;
  return children;
};

export default ProtectedRoute;
