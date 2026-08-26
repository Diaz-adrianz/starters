import { ClsStore } from 'nestjs-cls';
import { Scope } from '../../shared/interfaces/resource-scope.interface';
import { DeviceType } from '../../shared/constants/device-types.constant';

export interface Store extends ClsStore {
  requestId: string;
  actor: {
    type: 'user';
    id: string;
    name: string;
    roles: { id: string; name: string }[];
  } | null;
  permission: {
    module: string;
    resource: string;
    action: string;
    scopes: Scope[];
  } | null;
  session: {
    id: string;
  } | null;
  client: {
    deviceId?: string;
    deviceType?: DeviceType;
    deviceName?: string;
    ip?: string;
    userAgent?: string;
    refreshToken?: string;
  } | null;
}
