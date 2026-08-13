import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { type Cache } from 'cache-manager';
import { CacheKeys } from './constants/cache-keys.constant';

type CacheKeyInput = ((keys: typeof CacheKeys) => string) | string;
type CacheKeysInput = (keys: typeof CacheKeys) => string[];

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  private resolveKey(key: CacheKeyInput): string {
    return typeof key === 'string' ? key : key(CacheKeys);
  }

  private resolveKeys(keys: CacheKeysInput): string[] {
    return keys(CacheKeys);
  }

  get<T>(key: CacheKeyInput) {
    const resolvedKey = this.resolveKey(key);
    return this.cache.get<T>(resolvedKey);
  }

  set<T>(key: CacheKeyInput, value: T, ttl?: number) {
    const resolvedKey = this.resolveKey(key);
    return this.cache.set(resolvedKey, value, ttl);
  }

  del(key: CacheKeyInput) {
    const resolvedKey = this.resolveKey(key);
    return this.cache.del(resolvedKey);
  }

  delMany(keys: CacheKeysInput) {
    const resolvedKeys = this.resolveKeys(keys);
    return this.cache.mdel(resolvedKeys);
  }

  clear() {
    return this.cache.clear();
  }
}
