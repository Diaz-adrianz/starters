import authStore from '@/stores/auth.store';
import type { ReactNode } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

export const UnauthenticatedRoute = ({ children }: { children: ReactNode }) => {
  const authStatus = authStore((s) => s.status);
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  if (authStatus === 'authenticated')
    return <Navigate to={redirectTo} replace />;

  return children;
};
