import authStore from '@/stores/auth.store';
import { useSignIn, useSignOut } from '../api/auth.mutation';
import type { SignInValues } from '../schemas/auth.schema';
import { toast } from 'sonner';

export function useAuth() {
  const signInStore = authStore((s) => s.signIn),
    signOutStore = authStore((s) => s.signOut);

  const signInApi = useSignIn(),
    signOutApi = useSignOut({
      silent: true,
      onSettled() {
        signOutStore();
      },
    });

  const signIn = async (values: SignInValues) => {
    const { data } = await signInApi.mutateAsync(values);
    signInStore(
      {
        id: data.data.user.id,
        name: data.data.user.username,
        avatar: data.data.user.avatar,
      },
      data.data.tokens.access,
      data.data.tokens.refresh
    );
    toast.success('Sign in successful');
  };

  const signOut = async () => {
    const request = signOutApi.mutateAsync();
    toast.promise(request, { loading: 'Signing you out...' });
    await request;
  };

  return { signIn, signOut };
}
