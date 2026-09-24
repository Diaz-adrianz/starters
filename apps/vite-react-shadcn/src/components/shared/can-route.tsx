import { useAbility } from '@/app/providers';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface CanRouteProps {
  children: ReactNode;
  I: string;
  a: string;
  redirectTo?: string;
}

export const CanRoute = ({
  children,
  I,
  a,
  redirectTo = '/',
}: CanRouteProps) => {
  const ability = useAbility();
  const allowed = ability.can(I, a);

  if (!allowed) return <Navigate to={redirectTo} replace />;

  return children;
};
