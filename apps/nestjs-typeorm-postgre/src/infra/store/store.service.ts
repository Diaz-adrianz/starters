import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Store } from './store.interface';
import { ResourceQuery } from '../../shared/classes/resource-query.class';
import { Query } from '../../shared/interfaces/resource-query.interface';
import { Operator } from '../../modules/access-control/interfaces/condition.interface';
import {
  isArray,
  isBoolean,
  isDate,
  isNumber,
  isString,
} from 'class-validator';

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
  buildResourceQuery() {
    const rq = new ResourceQuery(),
      conditions = this.get('permission')?.conditions;

    if (conditions?.length)
      conditions.forEach((condition) => {
        Object.entries(condition).forEach(([field, scalars]) => {
          const query: Query = [];
          Object.entries(scalars).forEach(([key, value]) => {
            const op = key as Operator;
            if (
              (op === 'eq' || op === 'neq') &&
              (isString(value) ||
                isNumber(value) ||
                isBoolean(value) ||
                isDate(value) ||
                value === null)
            )
              query.push([field, op, value]);
            else if (
              (op === 'lt' || op === 'lte' || op === 'gt' || op === 'gte') &&
              (isString(value) || isNumber(value) || isDate(value))
            )
              query.push([field, op, value]);
            else if (
              (op === 'in' || op === 'nin') &&
              isArray(value) &&
              value.every((v) => isString(v) || isNumber(v) || isDate(v))
            )
              query.push([field, op, value]);
          });

          if (query.length)
            rq.add(query, 'or', '*', {
              actor: this.get('actor') ?? {},
            });
        });
      });

    return rq;
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
