import { AuthEventPayload } from './auth-event.interface';

export type EventPayload = AuthEventPayload;

export type EventKey = keyof EventPayload;
