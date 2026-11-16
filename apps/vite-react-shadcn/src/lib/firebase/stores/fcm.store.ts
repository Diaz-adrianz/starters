import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { deleteToken, getToken } from 'firebase/messaging';
import {
  getMessagingInstance,
  registerServiceWorker,
  VAPID_KEY,
} from '../messaging.config';
import { PushTokenApi } from '@/features/notification';

type FcmState = {
  enabled: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
};

type FcmAction = {
  enable: () => Promise<void>;
  disable: () => Promise<void>;
  toggle: () => Promise<void>;
  sync: () => Promise<void>;
};

const fcmStore = create<FcmState & FcmAction>()(
  persist(
    (set, get) => ({
      enabled: true,
      token: null,
      loading: false,
      error: null,
      enable: async () => {
        set({ loading: true, error: null });
        try {
          const messaging = await getMessagingInstance();
          if (!messaging) throw new Error('FCM unsupported');

          const permission = await Notification.requestPermission();
          if (permission !== 'granted') throw new Error('Permission denied');

          const sw = await registerServiceWorker();
          const token = await getToken(messaging, {
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: sw,
          });
          if (!token) throw new Error('No token');

          await PushTokenApi.register({
            provider: 'fcm',
            token,
            enabled: true,
          });
          set({ enabled: true, token });
        } catch (e) {
          set({ enabled: false, token: null, error: (e as Error).message });
        } finally {
          set({ loading: false });
        }
      },
      disable: async () => {
        set({ loading: true, error: null });
        try {
          const { token } = get();
          if (token) await PushTokenApi.revokeByToken(token).catch(() => {});
          const messaging = await getMessagingInstance();
          if (messaging) await deleteToken(messaging);
          set({ enabled: false, token: null });
        } catch (e) {
          set({ error: (e as Error).message });
        } finally {
          set({ loading: false });
        }
      },
      toggle: async () => (get().enabled ? get().disable() : get().enable()),
      sync: async () => {
        const { enabled, token } = get();
        if (!enabled) return;
        try {
          const messaging = await getMessagingInstance();
          if (!messaging || Notification.permission !== 'granted') {
            set({ enabled: false, token: null });
            return;
          }

          const sw = await registerServiceWorker();
          const fresh = await getToken(messaging, {
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: sw,
          });

          if (fresh && fresh !== token) {
            if (token) await PushTokenApi.revokeByToken(token).catch(() => {});
            await PushTokenApi.register({
              provider: 'fcm',
              token: fresh,
              enabled: true,
            });
            set({ token: fresh });
          }
        } catch (e) {
          console.log(e);
          set({ error: (e as Error).message });
        }
      },
    }),
    {
      name: 'fcm-store',
      partialize: (s) => ({ enabled: s.enabled, token: s.token }),
    }
  )
);

export { fcmStore };
