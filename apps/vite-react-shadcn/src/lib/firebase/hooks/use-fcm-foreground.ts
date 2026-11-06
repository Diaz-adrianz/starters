import { useEffect } from 'react';
import { onMessage } from 'firebase/messaging';
import { fcmStore } from '../stores/fcm.store';
import { getMessagingInstance } from '../messaging.config';
import { toast } from 'sonner';

export const useFcmForeground = () => {
  const enabled = fcmStore((s) => s.enabled),
    sync = fcmStore((s) => s.sync);

  useEffect(() => {
    sync();
  }, [sync]);

  useEffect(() => {
    if (!enabled) return;
    let unsub: (() => void) | undefined;

    getMessagingInstance().then((m) => {
      if (!m) return;
      unsub = onMessage(m, (payload) => {
        toast(payload.notification?.title ?? 'Notification', {
          description: payload.notification?.body,
          duration: 5000,
        });
      });
    });

    return () => unsub?.();
  }, [enabled]);
};
