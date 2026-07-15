import { Inject, Injectable } from '@nestjs/common';
import type { RedisClientType } from 'redis';
import { CacheKeys } from './constants/cache-keys.constant';

type CacheKeyInput = ((keys: typeof CacheKeys) => string) | string;

@Injectable()
export class DefaultCacheService {
  constructor(
    @Inject('DEFAULT_CACHE_CLIENT') private redisClient: RedisClientType,
  ) {}

  private resolveKey(key: CacheKeyInput): string {
    return typeof key === 'string' ? key : key(CacheKeys);
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

  async del(key: CacheKeyInput): Promise<string | undefined> {
    const resolvedKey = this.resolveKey(key);
    try {
      await this.redisClient.del(resolvedKey);
      return resolvedKey;
    } catch {
      // silent
    }
  }

  async delMany(keys: string[]): Promise<number> {
    try {
      return this.redisClient.del(keys);
    } catch {
      return 0;
    }
  }

  async scanKeys(pattern: CacheKeyInput): Promise<string[]> {
    const resolvedPattern = this.resolveKey(pattern);
    const foundKeys: string[] = [];
    try {
      for await (const keys of this.redisClient.scanIterator({
        MATCH: resolvedPattern + '*',
        COUNT: 100,
      }))
        foundKeys.push(...keys);
    } catch {
      // silent
    }
    return foundKeys;
  }

  async delByPattern(pattern: CacheKeyInput): Promise<number> {
    const keys = await this.scanKeys(pattern);
    if (keys.length === 0) return 0;
    try {
      return await this.redisClient.del(keys);
    } catch {
      return 0;
    }
  }

  async findByPattern<T>(
    pattern: CacheKeyInput,
    withKey: true,
  ): Promise<{ key: string; value: T }[]>;
  async findByPattern<T>(pattern: CacheKeyInput, withKey?: false): Promise<T[]>;
  async findByPattern<T>(
    pattern: CacheKeyInput,
    withKey: boolean = false,
  ): Promise<{ key: string; value: T }[] | T[]> {
    const keys = await this.scanKeys(pattern);
    if (keys.length === 0) return [];

    try {
      const values = await this.redisClient.mGet(keys);
      const parsed = keys
        .map((key, i) => {
          const raw = values[i];
          if (raw === null || raw === undefined) return null;
          try {
            return { key, value: JSON.parse(raw) as T };
          } catch {
            return null;
          }
        })
        .filter((entry): entry is { key: string; value: T } => entry !== null);

      return withKey ? parsed : parsed.map((entry) => entry.value);
    } catch {
      return [];
    }
  }
}
