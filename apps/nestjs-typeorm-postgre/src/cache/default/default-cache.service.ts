import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class DefaultCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  set<T>(key: string, value: T, ttl?: number) {
    return this.cacheManager.set(key, value, ttl);
  }

  get<T>(key: string) {
    return this.cacheManager.get<T>(key);
  }

  del(key: string) {
    return this.cacheManager.del(key);
  }
}
