import { isArray, isString } from 'class-validator';
import {
  JoinStrategy,
  Scope,
  ScopeContext,
  NestedFields,
  Operator,
  Condition,
  OrderDir,
} from '../interfaces/resource-scope.interface';
import { ResourceQueryDto } from '../dto/resource-query.dto';
import { plainToInstance } from 'class-transformer';
import { castValue } from '../utils/transformer.util';
import {
  And,
  Between,
  Equal,
  FindOperator,
  ILike,
  In,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
} from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import {
  CONDITION_SEPARATOR,
  FIELDS_SEPARATOR,
  SCOPE_SEPARATOR,
  VALUES_SEPARATOR,
} from '../constants/resource-scope.constant';

// ================================================================
// TypeORM FindOptions
// ----------------------------------------------------------------
interface ResourceScopeFindOptions {
  where: Record<string, any>[];
  order?: Record<string, any>;
  withDeleted?: boolean;
  skip?: number;
  take?: number;
}

// ----------------------------------------------------------------
export class ResourceScope {
  public scopes: Scope[] = [];

  // Options
  // ---------------------------------
  private skip?: number;
  private take?: number;
  private withDeleted: boolean = false;
  private order: { field: string; dir: OrderDir }[] = [];

  constructor(scope?: Scope) {
    this.scopes = scope ? [scope] : [];
  }

  public add(
    scope: Scope,
    joinStrategy: JoinStrategy = 'and',
    nestedFields: NestedFields = [],
    context?: ScopeContext,
  ) {
    scope = this.resolveFields(scope, nestedFields);
    if (context) scope = this.resolveScopeContext(scope, context);

    this.joinScope(scope, joinStrategy);
  }

  public addOrder(field: string, dir: OrderDir) {
    this.order.push({ field, dir });
  }

  public addQuery(
    query: ResourceQueryDto,
    joinStrategy: JoinStrategy = 'and',
    nestedFields: NestedFields = [],
    context?: ScopeContext,
  ) {
    const scope = this.toScope(query, nestedFields, context);
    this.joinScope(scope, joinStrategy);
  }

  private joinScope(scope: Scope, strategy: JoinStrategy = 'and') {
    if (strategy === 'and')
      this.scopes = this.scopes.length
        ? this.scopes.map((s) => [...s, ...scope])
        : [scope];
    else if (strategy === 'or') this.scopes = [...this.scopes, scope];
  }

  // ================================================================
  // Transformers
  // ----------------------------------------------------------------
  public toScope(
    query: ResourceQueryDto,
    nestedFields: NestedFields = [],
    context?: ScopeContext,
  ) {
    const scope: Scope = [];

    query =
      query instanceof ResourceQueryDto
        ? query
        : (plainToInstance(ResourceQueryDto, query) as ResourceQueryDto);

    if (query.limit) this.take = query.limit;
    if (query.page && query.page >= 1)
      this.skip = (query.page - 1) * (this.take || 0);

    if (query.trash) this.withDeleted = true;
    if (query.order) {
      const conditions = query.order.split(SCOPE_SEPARATOR);
      conditions.forEach((condition) => {
        const [field, value] = condition.split(CONDITION_SEPARATOR);
        if (value !== 'asc' && value !== 'desc') return;
        this.addOrder(field, value);
      });
    }

    (
      [
        'search',
        'starts',
        'where',
        'in',
        'nin',
        'isnull',
        'notnull',
        'gte',
        'lte',
        'between',
      ] as Operator[]
    ).forEach((op) => {
      if (!query[op] || typeof query[op] !== 'string') return;
      const conditions = query[op].split(SCOPE_SEPARATOR);
      conditions.forEach((condition) => {
        const [field, rawValue] = condition.split(CONDITION_SEPARATOR);

        if (!this.isFieldAllowed(field, nestedFields)) return;
        const value = context
          ? this.resolveValueContext(rawValue, context)
          : rawValue;

        if (op === 'search' || op === 'starts')
          scope.push({ field, op, value });
        else if (op === 'where')
          scope.push({
            field,
            op,
            value: castValue(value, ['string', 'number', 'boolean']),
          });
        else if (op === 'in' || op === 'nin')
          scope.push({
            field,
            op,
            value: value
              .split(VALUES_SEPARATOR)
              .map((v) => castValue(v, ['string', 'number', 'date'])),
          });
        else if (op === 'isnull' || op === 'notnull') scope.push({ field, op });
        else if (op === 'gte' || op === 'lte')
          scope.push({
            field,
            op,
            value: castValue(value, ['string', 'number', 'date']),
          });
        else if (op === 'between')
          scope.push({
            field,
            op,
            value: value
              .split(VALUES_SEPARATOR)
              .slice(0, 2)
              .map((v) => castValue(v, ['string', 'number', 'date'])),
          });
      });
    });

    return scope;
  }

  public toFindOptions(): ResourceScopeFindOptions {
    if (this.withDeleted)
      this.add([{ field: 'deletedAt', op: 'notnull' }], 'and', '*');

    const buildSubWhere = (
      subWhere: ResourceScopeFindOptions['where'][number],
      fields: string[],
      value: FindOperator<any> | string,
    ) => {
      const [head, ...rest] = fields;

      if (rest.length === 0) {
        if (subWhere[head] && !(subWhere[head] instanceof FindOperator))
          throw new BadRequestException(
            `Field "${head}" is not directly filterable`,
          );
        subWhere[head] =
          value instanceof FindOperator && subWhere[head]
            ? And(subWhere[head], value)
            : value;
        return;
      }

      if (subWhere[head] instanceof FindOperator)
        throw new BadRequestException(
          `Field "${head}" is not directly filterable`,
        );
      if (!subWhere[head]) subWhere[head] = {};

      buildSubWhere(subWhere[head], rest, value);
    };

    const where = this.scopes.map((scope) => {
      const subWhere: ResourceScopeFindOptions['where'][number] = {};

      scope.forEach((c) => {
        const fields = c.field.split(FIELDS_SEPARATOR);

        let value: FindOperator<any> | null = null;
        if (c.op === 'search') value = ILike(`%${c.value}%`);
        else if (c.op === 'starts') value = ILike(`${c.value}%`);
        else if (c.op === 'where') value = Equal(c.value);
        else if (c.op === 'in' && c.value.length) value = In(c.value);
        else if (c.op === 'nin' && c.value.length) value = Not(In(c.value));
        else if (c.op === 'isnull') value = IsNull();
        else if (c.op === 'notnull') value = Not(IsNull());
        else if (c.op === 'gte') value = MoreThanOrEqual(c.value);
        else if (c.op === 'lte') value = LessThanOrEqual(c.value);
        else if (c.op === 'between')
          value = Between(c.value.at(0), c.value.at(1));

        if (value) buildSubWhere(subWhere, fields, value);
      });

      return subWhere;
    });

    const order = this.order.length
      ? this.order.reduce<Record<string, any>>((a, c) => {
          const fields = c.field.split(FIELDS_SEPARATOR);
          let node = a;
          fields.forEach((f, i) => {
            if (i === fields.length - 1) node[f] = c.dir;
            else node = node[f] = node[f] ?? {};
          });
          return a;
        }, {})
      : undefined;

    return {
      where,
      order,
      skip: this.skip,
      take: this.take,
      withDeleted: this.withDeleted,
    };
  }

  // ================================================================
  // Field resolver
  // ----------------------------------------------------------------
  private resolveFields(scope: Scope, nestedFields: NestedFields) {
    if (nestedFields == '*') return scope;

    return scope.filter(({ field }) =>
      this.isFieldAllowed(field, nestedFields),
    );
  }

  private isFieldAllowed(field: string, nestedFields: NestedFields) {
    if (nestedFields === '*') return true;

    const parts = field.split(FIELDS_SEPARATOR);
    if (parts.length === 1) return true;

    const parent = parts.slice(0, -1).join(FIELDS_SEPARATOR);
    return (
      nestedFields.includes(field) ||
      nestedFields.includes(`${parent}${FIELDS_SEPARATOR}*`)
    );
  }

  // ================================================================
  // Context resolver
  // ----------------------------------------------------------------
  private resolveScopeContext(scope: Scope, context: ScopeContext) {
    return scope.map((condition) =>
      this.resolveConditionContext(condition, context),
    );
  }

  private resolveConditionContext(condition: Condition, context: ScopeContext) {
    if (!('value' in condition)) return condition;

    if (isString(condition.value))
      condition.value = this.resolveValueContext(condition.value, context);
    else if (isArray(condition.value))
      condition.value = condition.value.map((v) =>
        isString(v) ? this.resolveValueContext(v, context) : v,
      );

    return condition;
  }

  private resolveValueContext(value: string, context: ScopeContext) {
    return value.replace(
      /^\{\{([a-zA-Z_$][\w$]*(?:\.[a-zA-Z_$][\w$]*)*)\}\}$/,
      (_, path: string) => {
        const resolved = path
          .split(FIELDS_SEPARATOR)
          .reduce<any>((v, key) => v?.[key], context);
        if (resolved === undefined)
          throw new Error(`Context path "${path}" could not be resolved`);
        return String(resolved);
      },
    );
  }
}
