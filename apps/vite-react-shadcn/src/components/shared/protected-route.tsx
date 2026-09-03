import authStore from '@/stores/auth.store';
import { RiLoader2Line } from '@remixicon/react';
import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

type Props = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const authStatus = authStore((s) => s.status);

  if (authStatus === 'loading')
    return (
      <div className="flex w-full items-center justify-center gap-2 p-4 text-primary">
        <RiLoader2Line className="animate-spin" />
        <p>Authenticating...</p>
      </div>
    );
  else if (authStatus == 'unauthenticated')
    return <Navigate to={'/auth/signin'} />;
  else return children;
};

export default ProtectedRoute;
