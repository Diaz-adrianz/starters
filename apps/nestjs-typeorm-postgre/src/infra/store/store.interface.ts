import { ClsStore } from 'nestjs-cls';

export interface Store extends ClsStore {
  requestId: string;
}
