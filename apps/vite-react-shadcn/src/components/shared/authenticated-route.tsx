import authStore from '@/stores/auth.store';
import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

export const AuthenticatedRoute = ({ children }: { children: ReactNode }) => {
  const authStatus = authStore((s) => s.status);

  if (authStatus === 'unauthenticated') {
    const currentPath = location.pathname + location.search;
    return (
      <Navigate
        to={`/auth/signin?redirect=${encodeURIComponent(currentPath)}`}
      />
    );
  }

  return children;
};
