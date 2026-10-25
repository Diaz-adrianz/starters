import authStore from '@/stores/auth.store';
import { useEffect, useRef } from 'react';
import {
  disconnectNotificationSocket,
  notificationSocket,
} from '../api/notification.socket';

type MessageCreated = { id: string; title: string; body: string };

type Handlers = {
  onMessageCreated?: (data: MessageCreated) => void;
};

function useNotificationSocket({ onMessageCreated }: Handlers) {
  const authStatus = authStore((s) => s.status);
  const handlersRef = useRef({ onMessageCreated });
  // eslint-disable-next-line react-hooks/refs
  handlersRef.current = { onMessageCreated };

  useEffect(() => {
    if (authStatus !== 'authenticated') {
      disconnectNotificationSocket();
      return;
    }

    const socket = notificationSocket();
    if (!socket.connected) socket.connect();

    // handlers
    const handleMessageCreated = (data: MessageCreated) => {
      handlersRef.current.onMessageCreated?.(data);
    };

    // listeners
    socket.on('message.created', handleMessageCreated);

    return () => {
      socket.off('message.created', handleMessageCreated);
    };
  }, [authStatus]);
}

export { useNotificationSocket };
