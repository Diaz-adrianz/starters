import {
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { LoggerService } from '../logger/logger.service';
import { AppSocket } from './interfaces/socket.interface';
import { WebsocketService } from './websocket.service';
import { Inject, Injectable } from '@nestjs/common';
import { APP_CONFIG_KEY, type AppConfig } from '../../config/app.config';

@Injectable()
export abstract class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    @Inject(APP_CONFIG_KEY) protected appConfig: AppConfig,
    protected logger: LoggerService,
    protected connection: WebsocketService,
  ) {}

  handleConnection(client: AppSocket) {
    try {
      const token =
        (client.handshake.auth?.token as string | undefined) ??
        (this.appConfig.mode !== 'production'
          ? (client.handshake.query.token as string | undefined)
          : undefined);
      if (!token) throw new Error('Token not provided');

      const payload = this.connection.verifyJwtAccess(token);
      client.data = { user: { id: payload.sub } };

      this.connection.add(payload.sub, client.id);
      this.logger.log(`User ${payload.sub} connected`, this.constructor.name);
    } catch (error) {
      this.logger.warn(
        `WS connection rejected: `,
        error,
        this.constructor.name,
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: AppSocket) {
    if (client.data.user.id) {
      this.connection.remove(client.data.user.id, client.id);
      this.logger.log(
        `User ${client.data.user.id} disconnected`,
        this.constructor.name,
      );
    }
  }

  emitToUser(userId: string, event: string, payload: any) {
    const socketIds = this.connection.getSocketIds(userId);
    if (socketIds?.size) this.server.to([...socketIds]).emit(event, payload);
  }

  emitToUsers(userIds: string[], event: string, payload: any) {
    const socketIds = userIds.flatMap((id) => [
      ...(this.connection.getSocketIds(id) ?? []),
    ]);
    if (socketIds.length) this.server.to(socketIds).emit(event, payload);
  }
}
