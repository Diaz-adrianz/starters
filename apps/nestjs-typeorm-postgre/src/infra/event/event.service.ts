import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventKey, EventPayload } from './interfaces/events.interface';
import {
  AuditEventName,
  AuditEventPayload,
} from './interfaces/audit-event.interface';
import { StoreService } from '../store/store.service';

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
    >,
  ) {
    const actor = this.store.actor;

    return this.eventEmitter.emit(AuditEventName.ACTIVITY_LOG, {
      occuredAt: new Date(),
      requestId: this.store.get('requestId'),
      actorType: actor.type,
      actorId: actor.type === 'user' ? actor.id : null,
      actorName: actor.type === 'anon' ? null : actor.name,
      ...payload,
    } satisfies AuditEventPayload['audit.activity.log']);
  }
}
