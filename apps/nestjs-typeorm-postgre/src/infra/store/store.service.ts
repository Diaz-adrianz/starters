import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Store } from './store.interface';
import { ResourceScope } from '../../shared/classes/resource-scope.class';

@Injectable()
export class StoreService {
  constructor(private cls: ClsService<Store>) {}

  // Actor
  // --------------------------------
  get actor() {
    return this.getOrThrow('actor');
  }

  // Session
  // --------------------------------
  get session() {
    return this.getOrThrow('session');
  }

  // Permission
  // --------------------------------
  buildResourceScope() {
    const resourceScope = new ResourceScope(),
      scopes = this.get('permission')?.scopes;

    if (scopes?.length)
      scopes.forEach((scope) => {
        resourceScope.add(scope, 'or', '*', {
          actor: this.get('actor') ?? {},
        });
      });

    return resourceScope;
  }

  // Client
  // --------------------------------
  isWebClient() {
    return this.get('client')?.deviceType == 'web';
  }

  isMobileClient() {
    return (
      this.get('client')?.deviceType == 'android' ||
      this.get('client')?.deviceType == 'ios'
    );
  }

  // Basic APIs
  // --------------------------------
  set<K extends keyof Store>(key: K, value: Store[K]) {
    this.cls.set(key, value);
  }

  get<K extends keyof Store>(key: K): Store[K] {
    return this.cls.get(key);
  }

  getOrThrow<K extends keyof Store>(key: K): NonNullable<Store[K]> {
    const value = this.cls.get(key);
    if (!value) {
      throw new InternalServerErrorException(
        `Required store value "${String(key)}" is not available`,
      );
    }
    return value;
  }
}
