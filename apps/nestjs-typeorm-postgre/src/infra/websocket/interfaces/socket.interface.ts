import { Socket } from 'socket.io';

export interface SocketData {
  user: { id: string };
}

export type AppSocket = Socket<any, any, any, SocketData>;
