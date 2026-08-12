import { Inject, Injectable } from '@nestjs/common';
import { CacheKeys } from './constants/cache-keys.constant';
import Redis from 'ioredis';
import { LoggerService } from '../../../infra/logger/logger.service';

type CacheKeyInput = ((keys: typeof CacheKeys) => string) | string;
type CacheKeysInput = (keys: typeof CacheKeys) => string[];

@Injectable()
export class DefaultCacheService {
  constructor(
    @Inject('DEFAULT_CACHE_CLIENT') private redis: Redis,
    private logger: LoggerService,
  ) {}

  resolveKey(key: CacheKeyInput): string {
    return typeof key === 'string' ? key : key(CacheKeys);
  }

  resolveKeys(keys: CacheKeysInput): string[] {
    return keys(CacheKeys);
  }

  async set<T>(key: CacheKeyInput, value: T, opts: { EX?: number } = {}) {
    const resolvedKey = this.resolveKey(key);
    const serialized = JSON.stringify(value);

    try {
      if (opts.EX)
        return this.redis.set(resolvedKey, serialized, 'EX', opts.EX);
      else return this.redis.set(resolvedKey, serialized);
    } catch (err) {
      this.logger.error(
        `Cache set failed [${resolvedKey}]: ${(err as Error).message}`,
        'Cache',
      );
    }
  }

  async get<T>(key: CacheKeyInput): Promise<T | undefined> {
    const resolvedKey = this.resolveKey(key);
    try {
      const raw = await this.redis.get(resolvedKey);
      if (raw === null || raw === undefined) return;
      return JSON.parse(raw) as T;
    } catch (err) {
      this.logger.error(
        `Cache get failed [${resolvedKey}]: ${(err as Error).message}`,
        'Cache',
      );
    }
  }

  async getMany<T>(keys: CacheKeysInput): Promise<(T | null)[] | undefined> {
    const resolvedKeys = this.resolveKeys(keys);
    try {
      const raws = await this.redis.mget(resolvedKeys);
      if (raws === null || raws === undefined) return;
      return raws.map((raw) => (raw ? (JSON.parse(raw) as T) : null));
    } catch (err) {
      this.logger.error(
        `Cache get failed [${resolvedKeys.join(', ')}]: ${(err as Error).message}`,
        'Cache',
      );
    }
  }

  async del(key: CacheKeyInput): Promise<string | undefined> {
    const resolvedKey = this.resolveKey(key);
    try {
      await this.redis.del(resolvedKey);
      return resolvedKey;
    } catch (err) {
      this.logger.error(
        `Cache del failed [${resolvedKey}]: ${(err as Error).message}`,
        'Cache',
      );
    }
  }

  async delMany(keys: CacheKeysInput): Promise<number> {
    const resolvedKeys = this.resolveKeys(keys);
    try {
      return resolvedKeys.length ? this.redis.del(resolvedKeys) : 0;
    } catch (err) {
      this.logger.error(
        `Cache del failed [${resolvedKeys.join(', ')}]: ${(err as Error).message}`,
        'Cache',
      );
      return 0;
    }
  }

  // ================================================================
  // Set
  // ----------------------------------------------------------------
  async sadd(key: CacheKeyInput, value: string): Promise<string | undefined> {
    const resolvedKey = this.resolveKey(key);
    try {
      await this.redis.sadd(resolvedKey, value);
      return value;
    } catch (err) {
      this.logger.error(
        `Cache set add failed [${resolvedKey}]: ${(err as Error).message}`,
        'Cache',
      );
    }
  }

  async smembers(key: CacheKeyInput): Promise<string[]> {
    const resolvedKey = this.resolveKey(key);
    try {
      const value = await this.redis.smembers(resolvedKey);
      return value;
    } catch (err) {
      this.logger.error(
        `Cache set members failed [${resolvedKey}]: ${(err as Error).message}`,
        'Cache',
      );
      return [];
    }
  }

  async srem(
    key: CacheKeyInput,
    values: string[],
  ): Promise<number | undefined> {
    const resolvedKey = this.resolveKey(key);
    try {
      return this.redis.srem(resolvedKey, values);
    } catch (err) {
      this.logger.error(
        `Cache set rem failed [${resolvedKey}]: ${(err as Error).message}`,
        'Cache',
      );
    }
  }
}
