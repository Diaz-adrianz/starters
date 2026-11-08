import { ClsStore } from 'nestjs-cls';
import { Condition } from '../../modules/access-control/interfaces/condition.interface';
import { ClientType, DeviceType } from '../../shared/constants/device.constant';

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
  device?: {
    id?: string;
    label?: string;
    type?: DeviceType;
    client?: ClientType;
    browser?: string;
    os?: string;
    osVersion?: string;
    userAgent?: string;
    ipAddress?: string;
  };
}
