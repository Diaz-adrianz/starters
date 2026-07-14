import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { CacheKeys } from './constants/cache-keys.constant';

@Injectable()
export class DefaultCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  set<T>(
    key: ((keys: typeof CacheKeys) => string) | string,
    value: T,
    ttl?: number,
  ) {
    return this.cacheManager.set(
      typeof key === 'string' ? key : key(CacheKeys),
      value,
      ttl,
    );
  }

  get<T>(key: ((keys: typeof CacheKeys) => string) | string) {
    return this.cacheManager.get<T>(
      typeof key === 'string' ? key : key(CacheKeys),
    );
  }

  del(key: ((keys: typeof CacheKeys) => string) | string) {
    return this.cacheManager.del(
      typeof key === 'string' ? key : key(CacheKeys),
    );
  }
}
