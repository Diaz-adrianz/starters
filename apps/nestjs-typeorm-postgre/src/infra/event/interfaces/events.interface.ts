import { AccessControlEventPayload } from './access-control-event.interface';
import { AuthEventPayload } from './auth-event.interface';
import { IdentityEventPayload } from './identity-event.interface';

export type EventPayload = AuthEventPayload &
  IdentityEventPayload &
  AccessControlEventPayload;

export type EventKey = keyof EventPayload;
