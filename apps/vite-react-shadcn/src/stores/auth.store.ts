import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthUser = {
  id: string;
  name: string;
  avatar?: string | null;
};

type AuthStatus = 'authenticated' | 'unauthenticated';

type AuthState = {
  user: AuthUser | null;
  status: AuthStatus;
  accessToken: string | null;
  refreshToken: string | null;
};

type AuthAction = {
  setAccessToken: (accessToken: string) => void;
  signIn: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  signOut: () => void;
};

const authStore = create<AuthState & AuthAction>()(
  persist(
    (set) => ({
      user: null,
      status: 'unauthenticated',
      accessToken: null,
      refreshToken: null,
      setAccessToken(accessToken) {
        set({ accessToken });
      },
      signIn(user, accessToken, refreshToken) {
        set({
          user,
          status: 'authenticated',
          accessToken,
          refreshToken,
        });
      },
      signOut() {
        set({
          user: null,
          status: 'unauthenticated',
          accessToken: null,
          refreshToken: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        status: state.status,
        accessToken: state.accessToken,
      }),
    }
  )
);

export default authStore;
