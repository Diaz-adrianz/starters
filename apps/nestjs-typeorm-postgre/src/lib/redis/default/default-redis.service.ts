import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { LoggerService } from '../../../infra/logger/logger.service';
import { RedisKeys } from './constants/redis-keys.constant';

type RedisKeyInput = ((keys: typeof RedisKeys) => string) | string;
type RedisKeysInput = (keys: typeof RedisKeys) => string[];

@Injectable()
export class DefaultRedisService {
  constructor(
    @Inject('DEFAULT_REDIS_CLIENT') private redis: Redis,
    private logger: LoggerService,
  ) {}

  resolveKey(key: RedisKeyInput): string {
    return typeof key === 'string' ? key : key(RedisKeys);
  }

  resolveKeys(keys: RedisKeysInput): string[] {
    return keys(RedisKeys);
  }

  async set<T>(key: RedisKeyInput, value: T, opts: { EX?: number } = {}) {
    const resolvedKey = this.resolveKey(key);
    const serialized = JSON.stringify(value);

    try {
      if (opts.EX)
        return this.redis.set(resolvedKey, serialized, 'EX', opts.EX);
      else return this.redis.set(resolvedKey, serialized);
    } catch (err) {
      this.logger.error(
        `Redis set failed [${resolvedKey}]: ${(err as Error).message}`,
        'Redis',
      );
    }
  }

  async get<T>(key: RedisKeyInput): Promise<T | undefined> {
    const resolvedKey = this.resolveKey(key);
    try {
      const raw = await this.redis.get(resolvedKey);
      if (raw === null || raw === undefined) return;
      return JSON.parse(raw) as T;
    } catch (err) {
      this.logger.error(
        `Redis get failed [${resolvedKey}]: ${(err as Error).message}`,
        'Redis',
      );
    }
  }

  async getMany<T>(keys: RedisKeysInput): Promise<(T | null)[] | undefined> {
    const resolvedKeys = this.resolveKeys(keys);
    try {
      const raws = await this.redis.mget(resolvedKeys);
      if (raws === null || raws === undefined) return;
      return raws.map((raw) => (raw ? (JSON.parse(raw) as T) : null));
    } catch (err) {
      this.logger.error(
        `Redis get failed [${resolvedKeys.join(', ')}]: ${(err as Error).message}`,
        'Redis',
      );
    }
  }

  async del(key: RedisKeyInput): Promise<string | undefined> {
    const resolvedKey = this.resolveKey(key);
    try {
      await this.redis.del(resolvedKey);
      return resolvedKey;
    } catch (err) {
      this.logger.error(
        `Redis del failed [${resolvedKey}]: ${(err as Error).message}`,
        'Redis',
      );
    }
  }

  async delMany(keys: RedisKeysInput): Promise<number> {
    const resolvedKeys = this.resolveKeys(keys);
    try {
      return resolvedKeys.length ? this.redis.del(resolvedKeys) : 0;
    } catch (err) {
      this.logger.error(
        `Redis del failed [${resolvedKeys.join(', ')}]: ${(err as Error).message}`,
        'Redis',
      );
      return 0;
    }
  }

  // ================================================================
  // Set
  // ----------------------------------------------------------------
  async sadd(key: RedisKeyInput, value: string): Promise<string | undefined> {
    const resolvedKey = this.resolveKey(key);
    try {
      await this.redis.sadd(resolvedKey, value);
      return value;
    } catch (err) {
      this.logger.error(
        `Redis set add failed [${resolvedKey}]: ${(err as Error).message}`,
        'Redis',
      );
    }
  }

  async smembers(key: RedisKeyInput): Promise<string[]> {
    const resolvedKey = this.resolveKey(key);
    try {
      const value = await this.redis.smembers(resolvedKey);
      return value;
    } catch (err) {
      this.logger.error(
        `Redis set members failed [${resolvedKey}]: ${(err as Error).message}`,
        'Redis',
      );
      return [];
    }
  }

  async srem(
    key: RedisKeyInput,
    values: string[],
  ): Promise<number | undefined> {
    const resolvedKey = this.resolveKey(key);
    try {
      return this.redis.srem(resolvedKey, values);
    } catch (err) {
      this.logger.error(
        `Redis set rem failed [${resolvedKey}]: ${(err as Error).message}`,
        'Redis',
      );
    }
  }
}
