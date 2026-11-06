import authStore, { type AuthStatus } from '@/stores/auth.store';
import type { ReactNode } from 'react';
import {
  createPath,
  Navigate,
  useLocation,
  useSearchParams,
} from 'react-router-dom';

const getSafeRedirect = (value: string | null) =>
  value?.startsWith('/') && !value.startsWith('//') ? value : '/';

function AuthRoute({
  children,
  status = 'authenticated',
}: {
  children: ReactNode;
  status?: AuthStatus;
}) {
  const authStatus = authStore((s) => s.status);
  const { pathname, search } = useLocation();
  const [searchParams] = useSearchParams();

  if (status === 'authenticated' && authStatus === 'unauthenticated') {
    const currentPath = createPath({ pathname, search });
    return (
      <Navigate
        to={`/auth/signin?redirect=${encodeURIComponent(currentPath)}`}
        replace
      />
    );
  }

  if (status === 'unauthenticated' && authStatus === 'authenticated')
    return (
      <Navigate to={getSafeRedirect(searchParams.get('redirect'))} replace />
    );

  return children;
}

export { AuthRoute };
