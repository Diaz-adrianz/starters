import { AuthEventPayload } from './auth-event.interface';
import { IdentityEventPayload } from './identity-event.interface';

export type EventPayload = AuthEventPayload & IdentityEventPayload;

export type EventKey = keyof EventPayload;
