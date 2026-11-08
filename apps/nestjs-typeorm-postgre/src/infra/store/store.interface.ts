import { ClsStore } from 'nestjs-cls';
import { Condition } from '../../modules/access-control/interfaces/condition.interface';
import {
  ClientDevice,
  ClientType,
} from '../../shared/constants/client.constant';

export interface Store extends ClsStore {
  requestId: string;
  actor: {
    type: 'user';
    id: string;
    name: string;
  } | null;
  permission: {
    key: string;
    conditions: Condition[];
  } | null;
  session: {
    id: string;
  } | null;
  client?: {
    id?: string;
    label?: string;
    type?: ClientType;
    device?: ClientDevice;
    browser?: string;
    os?: string;
    osVersion?: string;
    userAgent?: string;
    ipAddress?: string;
  };
}
