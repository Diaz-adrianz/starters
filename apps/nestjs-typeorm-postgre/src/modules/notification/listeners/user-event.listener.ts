import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  EventName,
  EventPayload,
} from '../../../infra/event/interfaces/events.interface';

@Injectable()
export class UserEventListener {
  @OnEvent(EventName['user.signIn'])
  signIn(payload: EventPayload['user.signIn']) {
    console.log(payload);
  }
}
