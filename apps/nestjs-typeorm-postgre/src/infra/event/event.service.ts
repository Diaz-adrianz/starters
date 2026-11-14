import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventKey, EventPayload } from './interfaces/events.interface';
import {
  AuditEventName,
  AuditEventPayload,
} from './interfaces/audit-event.interface';
import { StoreService } from '../store/store.service';
import { StoreActor } from '../store/store.interface';

@Injectable()
export class EventService {
  constructor(
    private eventEmitter: EventEmitter2,
    private store: StoreService,
  ) {}

  emit<E extends EventKey>(event: E, payload: EventPayload[E]): boolean {
    return this.eventEmitter.emit(event, payload);
  }

  emitAuditActivityLog(
    payload: Pick<
      AuditEventPayload['audit.activity.log'],
      | 'module'
      | 'action'
      | 'resourceType'
      | 'resourceId'
      | 'outcome'
      | 'metadata'
    > & { actor?: StoreActor },
  ) {
    const actor = payload.actor ?? this.store.actor,
      client = this.store.get('client'),
      session = this.store.get('session'),
      permission = this.store.get('permission');

    return this.eventEmitter.emit(AuditEventName.ACTIVITY_LOG, {
      occuredAt: new Date(),
      requestId: this.store.get('requestId'),
      actorType: actor.type,
      actorId: actor.type === 'user' ? actor.id : null,
      actorName: actor.type === 'anon' ? null : actor.name,
      context: {
        sessionId: session?.id ?? null,
        permissionKey: permission?.key ?? null,
        clientId: client?.id ?? null,
        clientType: client?.type ?? null,
        device: client?.device ?? null,
        browser: client?.browser ?? null,
        os: client?.os ?? null,
        ipAddress: client?.ipAddress ?? null,
        userAgent: client?.userAgent ?? null,
      },
      ...payload,
    } satisfies AuditEventPayload['audit.activity.log']);
  }
}
