import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Store } from './store.interface';

@Injectable()
export class StoreService {
  constructor(private cls: ClsService<Store>) {}

  set<K extends keyof Store>(key: K, value: Store[K]) {
    this.cls.set(key, value);
  }

  get<K extends keyof Store>(key: K) {
    return this.cls.get(key);
  }
}
