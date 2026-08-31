import { WebSocketGateway } from '@nestjs/websockets';
import { WebsocketGateway } from '../../infra/websocket/websocket.gateway';
import {
  GatewayEvent,
  GatewayEventPayload,
} from './interfaces/gateway-event.interfaces';

@WebSocketGateway({
  namespace: '/notifications',
})
export class NotificationGateway extends WebsocketGateway {
  emitToUser<T extends GatewayEvent>(
    userId: string,
    event: T,
    payload: GatewayEventPayload[T],
  ): void {
    super.emitToUser(userId, event, payload);
  }
}
