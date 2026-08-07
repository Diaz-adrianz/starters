import { Inject, Injectable } from '@nestjs/common';
import type { RedisClientType } from 'redis';
import { CacheKeys } from './constants/cache-keys.constant';

type CacheKeyInput = ((keys: typeof CacheKeys) => string) | string;
type CacheKeysInput = (keys: typeof CacheKeys) => string[];

@Injectable()
export class DefaultCacheService {
  constructor(
    @Inject('DEFAULT_CACHE_CLIENT') private redisClient: RedisClientType,
  ) {}

  resolveKey(key: CacheKeyInput): string {
    return typeof key === 'string' ? key : key(CacheKeys);
  }

  resolveKeys(keys: CacheKeysInput): string[] {
    return keys(CacheKeys);
  }

  async set<T>(
    key: CacheKeyInput,
    value: T,
    ttlMs?: number,
  ): Promise<T | undefined> {
    const resolvedKey = this.resolveKey(key);
    try {
      await this.redisClient.set(resolvedKey, JSON.stringify(value), {
        PX: ttlMs,
      });
      return value;
    } catch {
      // silent
    }
  }

  async get<T>(key: CacheKeyInput): Promise<T | undefined> {
    const resolvedKey = this.resolveKey(key);
    try {
      const raw = await this.redisClient.get(resolvedKey);
      if (raw === null || raw === undefined) return undefined;
      return JSON.parse(raw) as T;
    } catch {
      // silent
    }
  }

  async getMany<T>(keys: CacheKeysInput): Promise<(T | null)[] | undefined> {
    const resolvedKeys = this.resolveKeys(keys);
    try {
      const raws = await this.redisClient.mGet(resolvedKeys);
      if (raws === null || raws === undefined) return undefined;
      return raws.map((raw) => (raw ? (JSON.parse(raw) as T) : null));
    } catch {
      // silent
    }
  }

  async del(key: CacheKeyInput): Promise<string | undefined> {
    const resolvedKey = this.resolveKey(key);
    try {
      await this.redisClient.del(resolvedKey);
      return resolvedKey;
    } catch {
      // silent
    }
  }

  async delMany(keys: CacheKeysInput): Promise<number> {
    const resolvedKeys = this.resolveKeys(keys);
    try {
      return this.redisClient.del(resolvedKeys);
    } catch {
      return 0;
    }
  }

  // ================================================================
  // Set
  // ----------------------------------------------------------------
  async sadd(key: CacheKeyInput, value: string): Promise<string | undefined> {
    const resolvedKey = this.resolveKey(key);
    try {
      await this.redisClient.sAdd(resolvedKey, value);
      return value;
    } catch {
      // silent
    }
  }

  async smembers(key: CacheKeyInput): Promise<string[]> {
    const resolvedKey = this.resolveKey(key);
    try {
      const value = await this.redisClient.sMembers(resolvedKey);
      return value;
    } catch {
      return [];
    }
  }

  async srem(
    key: CacheKeyInput,
    values: string[],
  ): Promise<number | undefined> {
    const resolvedKey = this.resolveKey(key);
    try {
      return this.redisClient.sRem(resolvedKey, values);
    } catch {
      // silent
    }
  }
}
