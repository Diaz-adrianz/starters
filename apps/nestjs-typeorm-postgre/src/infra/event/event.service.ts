import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventKey, EventPayload } from './interfaces/events.interface';

@Injectable()
export class EventService {
  constructor(private eventEmitter: EventEmitter2) {}

  emit<E extends EventKey>(event: E, payload: EventPayload[E]): boolean {
    return this.eventEmitter.emit(event, payload);
  }
}
