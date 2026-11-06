import { io, type Socket } from 'socket.io-client';
import { EnvConfig } from '@/config/env.config';
import authStore from '@/stores/auth.store';

let socket: Socket | null = null;

export const notificationSocket = (): Socket => {
  if (socket) return socket;

  socket = io(`${EnvConfig.API_URL}/notifications`, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    auth: (cb) => {
      const token = authStore.getState().accessToken;
      cb({ token });
    },
  });

  return socket;
};

export const disconnectNotificationSocket = () => {
  socket?.disconnect();
  socket = null;
};
