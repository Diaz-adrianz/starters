import { create } from 'zustand';

type AuthActor = {
  id: string;
  name: string;
  avatar?: string | null;
};

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthState = {
  actor: AuthActor | null;
  status: AuthStatus;
  accessToken: string | null;
};

type AuthAction = {
  setActor: (actor: AuthState['actor']) => void;
  setStatus: (status: AuthState['status']) => void;
  setAccessToken: (token: AuthState['accessToken']) => void;
  clear: () => void;
};

const authStoreInit: AuthState = {
  actor: null,
  status: 'loading',
  accessToken: null,
};

const authStore = create<AuthState & AuthAction>((set) => ({
  ...authStoreInit,
  setActor: (actor) => {
    set({ actor });
  },
  setStatus: (status) => {
    set({ status });
  },
  setAccessToken: (token) => {
    set({ accessToken: token });
  },
  clear: () => {
    set({ ...authStoreInit });
  },
}));

export default authStore;
