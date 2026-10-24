import { Can as CaslCan } from '@casl/react';
import { useAbility } from '@/app/providers';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

const Can = CaslCan;

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

export { Can, CanRoute };
