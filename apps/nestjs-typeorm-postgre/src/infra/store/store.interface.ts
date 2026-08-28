import { ClsStore } from 'nestjs-cls';
import { Scope } from '../../shared/interfaces/resource-scope.interface';

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
  device?: {
    id?: string;
    label?: string;
    type?: string;
    browser?: string;
    os?: string;
    userAgent?: string;
    ipAddress?: string;
  };
}
