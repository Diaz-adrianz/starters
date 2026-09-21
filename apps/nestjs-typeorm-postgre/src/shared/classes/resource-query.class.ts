import { isArray, isString } from 'class-validator';
import {
  CONDITION_SEPARATOR,
  FIELDS_SEPARATOR,
  QUERY_SEPARATOR,
  QueryAllowedFields,
  Query,
  QueryJoin,
  QueryContext,
  Condition,
  QueryOrder,
  QuerySearch,
  OPERATORS,
  VALUES_SEPARATOR,
  TypeOrmFindOptions,
} from '../interfaces/resource-query.interface';
import { ResourceQueryDto } from '../dto/resource-query.dto';
import { plainToInstance } from 'class-transformer';
import { castValue } from '../utils/transformer.util';
import {
  And,
  Equal,
  FindOperator,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';

export class ResourceQuery {
  public queries: Query[] = [];

  private skip?: number;
  private take?: number;
  private withDeleted?: boolean;
  private search: QuerySearch = {};
  private order: QueryOrder = {};

  constructor(query?: Query) {
    this.queries = query ? [query] : [];
  }

  public add(
    query: Query,
    join: QueryJoin = 'and',
    allowedFields: QueryAllowedFields = [],
    context?: QueryContext,
  ) {
    query = this.resolveFields(query, allowedFields);
    if (context) query = this.resolveContext(query, context);
    this.join(query, join);
    return this;
  }

  public addFromDto(
    dto: ResourceQueryDto,
    join: QueryJoin = 'and',
    allowedFields: QueryAllowedFields = [],
    context?: QueryContext,
  ) {
    dto =
      dto instanceof ResourceQueryDto
        ? dto
        : (plainToInstance(
            ResourceQueryDto,
            dto,
          ) as unknown as ResourceQueryDto);

    const query = this.fromDtoToQuery(dto);
    this.add(query, join, allowedFields, context);

    this.take = dto.limit;
    this.skip = (dto.page - 1) * (this.take || 0);
    this.withDeleted = dto.trash;

    if (dto.search)
      dto.search.split(QUERY_SEPARATOR).forEach((condition) => {
        const [field, value] = condition.split(CONDITION_SEPARATOR);
        this.addSearch(field, value, allowedFields);
      });

    if (dto.order)
      dto.order.split(QUERY_SEPARATOR).forEach((condition) => {
        const [field, value] = condition.split(CONDITION_SEPARATOR);
        this.addOrder(field, value as QueryOrder[string], allowedFields);
      });

    return this;
  }

  // ----------------------------------------------------------------
  public addSearch(
    field: string,
    dir: QuerySearch[string],
    allowedFields: QueryAllowedFields = [],
  ) {
    if (this.isFieldAllowed(field, allowedFields))
      this.search = {
        ...this.search,
        [field]: dir,
      };

    return this;
  }

  public addOrder(
    field: string,
    dir: QueryOrder[string],
    allowedFields: QueryAllowedFields = [],
  ) {
    if (this.isFieldAllowed(field, allowedFields))
      this.order = {
        ...this.order,
        [field]: dir,
      };

    return this;
  }

  // ================================================================
  // Join
  // ----------------------------------------------------------------
  public join(query: Query, join: QueryJoin) {
    if (join === 'and')
      this.queries = this.queries.length
        ? this.queries.map((s) => [...s, ...query])
        : [query];
    else if (join === 'or') this.queries = [...this.queries, query];

    return this;
  }

  // ================================================================
  // Transformer
  // ----------------------------------------------------------------
  private fromDtoToQuery(dto: ResourceQueryDto) {
    const query: Query = [];

    OPERATORS.forEach((op) => {
      if (!dto[op]) return;
      dto[op].split(QUERY_SEPARATOR).forEach((condition) => {
        const [field, value] = condition.split(CONDITION_SEPARATOR);
        if (op === 'eq' || op === 'neq')
          query.push({
            field,
            op,
            value: castValue(value, [
              'string',
              'number',
              'boolean',
              'date',
              'null',
            ]),
          });
        else if (op === 'lt' || op === 'lte' || op === 'gt' || op === 'gte')
          query.push({
            field,
            op,
            value: castValue(value, ['string', 'number', 'date']),
          });
        else if (op === 'in' || op === 'nin')
          query.push({
            field,
            op,
            value: value
              .split(VALUES_SEPARATOR)
              .map((v) => castValue(v, ['string', 'number', 'date'])),
          });
      });
    });

    return query;
  }

  public toFindOptions(): TypeOrmFindOptions {
    if (this.withDeleted)
      this.add([{ field: 'deletedAt', op: 'neq', value: null }], 'and', '*');

    const buildSubWhere = (
      subWhere: TypeOrmFindOptions['where'][number],
      fields: string[],
      value: FindOperator<any>,
    ) => {
      const [head, ...rest] = fields;

      if (rest.length === 0) {
        if (subWhere[head] && !(subWhere[head] instanceof FindOperator))
          throw new Error(`Field conflict: "${fields.join(FIELDS_SEPARATOR)}"`);

        subWhere[head] =
          value instanceof FindOperator && subWhere[head]
            ? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              And(subWhere[head], value)
            : value;
        return;
      }

      if (subWhere[head] instanceof FindOperator)
        throw new Error(`Field conflict: "${fields.join(FIELDS_SEPARATOR)}"`);
      if (!subWhere[head]) subWhere[head] = {};

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      buildSubWhere(subWhere[head], rest, value);
    };

    const buildWhere = (
      query: Query,
      search?: [string, string],
    ): TypeOrmFindOptions['where'][number] => {
      const subWhere: TypeOrmFindOptions['where'][number] = {};

      query.forEach((c) => {
        const fields = c.field.split(FIELDS_SEPARATOR);

        let value: FindOperator<any> | null = null;

        if (c.op === 'eq') value = c.value === null ? IsNull() : Equal(c.value);
        else if (c.op === 'neq')
          value = Not(c.value === null ? IsNull() : Equal(c.value));
        else if (c.op === 'lt') value = LessThan(c.value);
        else if (c.op === 'lte') value = LessThanOrEqual(c.value);
        else if (c.op === 'gt') value = MoreThan(c.value);
        else if (c.op === 'gte') value = MoreThanOrEqual(c.value);
        else if (c.op === 'in') value = In(c.value);
        else if (c.op === 'nin') value = Not(In(c.value));

        if (value) buildSubWhere(subWhere, fields, value);
      });

      if (search) {
        const [field, value] = search;

        buildSubWhere(
          subWhere,
          field.split(FIELDS_SEPARATOR),
          ILike(`%${value}%`),
        );
      }

      return subWhere;
    };

    const searchEntries = Object.entries(this.search);

    const where = (this.queries.length ? this.queries : [[]]).flatMap(
      (query) =>
        searchEntries.length
          ? searchEntries.map(([field, value]) =>
              buildWhere(query, [field, value]),
            )
          : [buildWhere(query)],
    );

    const order: TypeOrmFindOptions['order'] = {};

    const buildOrder = (
      target: TypeOrmFindOptions['order'],
      fields: string[],
      value: QueryOrder[string],
    ) => {
      const [head, ...rest] = fields;

      if (rest.length === 0) {
        target[head] = value.toUpperCase();
        return;
      }

      if (!target[head]) target[head] = {};

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      buildOrder(target[head], rest, value);
    };

    Object.entries(this.order).forEach(([field, direction]) =>
      buildOrder(order, field.split(FIELDS_SEPARATOR), direction),
    );

    return {
      where,
      order,
      take: this.take,
      skip: this.skip,
      withDeleted: this.withDeleted,
    };
  }

  // ================================================================
  // Field resolver
  // ----------------------------------------------------------------
  private resolveFields(query: Query, allowedFields: QueryAllowedFields) {
    if (allowedFields == '*') return query;

    return query.filter(({ field }) =>
      this.isFieldAllowed(field, allowedFields),
    );
  }

  private isFieldAllowed(field: string, allowedFields: QueryAllowedFields) {
    if (allowedFields === '*') return true;

    const parts = field.split(FIELDS_SEPARATOR);
    if (parts.length === 1) return true;

    const parent = parts.slice(0, -1).join(FIELDS_SEPARATOR);
    return (
      allowedFields.includes(field) ||
      allowedFields.includes(`${parent}${FIELDS_SEPARATOR}*`)
    );
  }

  // ================================================================
  // Context resolver
  // ----------------------------------------------------------------
  private resolveContext(query: Query, context: QueryContext) {
    return query.map((condition) =>
      this.resolveConditionContext(condition, context),
    );
  }

  private resolveConditionContext(condition: Condition, context: QueryContext) {
    if (isString(condition.value))
      condition.value = this.resolveValueContext(condition.value, context);
    else if (isArray(condition.value))
      condition.value = condition.value.map((v) =>
        isString(v) ? this.resolveValueContext(v, context) : v,
      );

    return condition;
  }

  private resolveValueContext(value: string, context: QueryContext) {
    return value.replace(
      /^\{\{([a-zA-Z_$][\w$]*(?:\.[a-zA-Z_$][\w$]*)*)\}\}$/,
      (_, path: string) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const resolved = path
          .split(FIELDS_SEPARATOR)
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
          .reduce<any>((v, key) => v?.[key], context);
        if (resolved === undefined)
          throw new Error(`Context path "${path}" could not be resolved`);
        return String(resolved);
      },
    );
  }
}
