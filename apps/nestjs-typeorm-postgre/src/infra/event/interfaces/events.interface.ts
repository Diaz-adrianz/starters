import { AccessControlEventPayload } from './access-control-event.interface';
import { AuditEventPayload } from './audit-event.interface';
import { AuthEventPayload } from './auth-event.interface';
import { IdentityEventPayload } from './identity-event.interface';

export type EventPayload = AuthEventPayload &
  IdentityEventPayload &
  AccessControlEventPayload &
  AuditEventPayload;

export type EventKey = keyof EventPayload;
