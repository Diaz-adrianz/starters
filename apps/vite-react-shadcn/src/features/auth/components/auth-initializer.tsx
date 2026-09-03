import { useEffect, type ReactNode } from 'react';
import { useMe } from '../api/auth.queries';
import authStore from '@/stores/auth.store';

export const AuthInitializer = ({ children }: { children: ReactNode }) => {
  const { data, isError, isSuccess } = useMe();
  const setActor = authStore((s) => s.setActor);
  const setStatus = authStore((s) => s.setStatus);

  useEffect(() => {
    if (isSuccess && data) {
      setActor({
        id: data.data.data.user.id,
        name: data.data.data.user.username,
        avatar: data.data.data.user.avatar,
      });
      setStatus('authenticated');
    }
    if (isError) setStatus('unauthenticated');
  }, [isSuccess, isError, data, setActor, setStatus]);

  return children;
};
