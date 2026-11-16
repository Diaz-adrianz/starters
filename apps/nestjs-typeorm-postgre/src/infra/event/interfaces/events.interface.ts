import { AuditEventPayload } from './audit-event.interface';
import { AuthEventPayload } from './auth-event.interface';
import { IdentityEventPayload } from './identity-event.interface';

export type EventPayload = AuthEventPayload &
  IdentityEventPayload &
  AuditEventPayload;

export type EventKey = keyof EventPayload;
