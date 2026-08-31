import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisKeys } from './constants/redis-keys.constant';

type RedisKeyInput = ((keys: typeof RedisKeys) => string) | string;
type RedisKeysInput = (keys: typeof RedisKeys) => string[];

@Injectable()
export class DefaultRedisService {
  constructor(@Inject('DEFAULT_REDIS_CLIENT') private redis: Redis) {}

  resolveKey(key: RedisKeyInput): string {
    return typeof key === 'string' ? key : key(RedisKeys);
  }

  resolveKeys(keys: RedisKeysInput): string[] {
    return keys(RedisKeys);
  }

  async set<T>(key: RedisKeyInput, value: T, opts: { EX?: number } = {}) {
    const resolvedKey = this.resolveKey(key);
    const serialized = JSON.stringify(value);

    if (opts.EX) return this.redis.set(resolvedKey, serialized, 'EX', opts.EX);
    else return this.redis.set(resolvedKey, serialized);
  }

  async get<T>(key: RedisKeyInput): Promise<T | undefined> {
    const resolvedKey = this.resolveKey(key);
    const raw = await this.redis.get(resolvedKey);
    if (raw === null || raw === undefined) return;
    return JSON.parse(raw) as T;
  }

  async getMany<T>(keys: RedisKeysInput): Promise<(T | null)[] | undefined> {
    const resolvedKeys = this.resolveKeys(keys);
    const raws = await this.redis.mget(resolvedKeys);
    if (raws === null || raws === undefined) return;
    return raws.map((raw) => (raw ? (JSON.parse(raw) as T) : null));
  }

  async del(key: RedisKeyInput): Promise<number | undefined> {
    const resolvedKey = this.resolveKey(key);
    return this.redis.del(resolvedKey);
  }

  async delMany(keys: RedisKeysInput): Promise<number> {
    const resolvedKeys = this.resolveKeys(keys);
    return resolvedKeys.length ? this.redis.del(resolvedKeys) : 0;
  }

  // ================================================================
  // Set
  // ----------------------------------------------------------------
  async sadd(key: RedisKeyInput, value: string): Promise<number | undefined> {
    const resolvedKey = this.resolveKey(key);
    return this.redis.sadd(resolvedKey, value);
  }

  async smembers(key: RedisKeyInput): Promise<string[]> {
    const resolvedKey = this.resolveKey(key);
    return this.redis.smembers(resolvedKey);
  }

  async srem(
    key: RedisKeyInput,
    values: string[],
  ): Promise<number | undefined> {
    const resolvedKey = this.resolveKey(key);
    return this.redis.srem(resolvedKey, values);
  }
}
