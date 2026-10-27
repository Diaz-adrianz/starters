import { useAbility } from '@casl/react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

function CanRoute({
  children,
  I,
  a,
  redirectTo = '/',
}: {
  children: ReactNode;
  I: string;
  a: string;
  redirectTo?: string;
}) {
  const ability = useAbility();
  const allowed = ability.can(I, a);

  if (!allowed) return <Navigate to={redirectTo} replace />;

  return children;
}

export { CanRoute };
