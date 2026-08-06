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
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  ResourceScopeDto,
} from '../dto/resource-scope.dto';
import { castValue } from '../utils/transformer.util';
import { plainToInstance } from 'class-transformer';

export const PAIR_SEPARATOR = ':';
export const PAIRS_SEPARATOR = ';';
export const KEYS_SEPARATOR = '.';
export const VALUES_SEPARATOR = ',';

export interface ResourceScopeOptions {
  where: Record<string, any>[];
  order: Record<string, any>;
  withDeleted: boolean;
}

export interface ResourceScopePageOptions extends ResourceScopeOptions {
  skip: number;
  take: number;
}

export type ClauseOperator = keyof Omit<
  ResourceScopeDto,
  'limit' | 'page' | 'order' | 'trash'
>;

const ResourceScopeClauseOperator: Record<
  ClauseOperator,
  (value: string) => FindOperator<any>
> = {
  search: (v) => ILike(`%${v}%`),
  starts: (v) => ILike(`${v}%`),
  where: (v) => Equal(castValue(v)),
  in: (v) => In(v.split(VALUES_SEPARATOR).map((v) => castValue(v))),
  nin: (v) => Not(In(v.split(VALUES_SEPARATOR).map((v) => castValue(v)))),
  isnull: () => IsNull(),
  notnull: () => Not(IsNull()),
  gte: (v) => MoreThanOrEqual(castValue(v)),
  lte: (v) => LessThanOrEqual(castValue(v)),
  between: (v) => {
    const [start, end] = v.split(VALUES_SEPARATOR);
    return Between(castValue(start), castValue(end));
  },
};

export class ResourceScope {
  where: ResourceScopeOptions['where'] = [];

  // view
  private order: ResourceScopeOptions['order'] = {};
  private skip: ResourceScopePageOptions['skip'] = 0;
  private take: ResourceScopePageOptions['take'] = 0;
  private withDeleted: ResourceScopeOptions['withDeleted'] = false;

  constructor(scope?: ResourceScopeDto, relations?: string[] | 'auto') {
    if (scope) this.add(scope, 'AND', relations);
  }

  public add(
    scope: ResourceScopeDto,
    strategy: 'OR' | 'AND' = 'AND',
    relations: string[] | 'auto' = [],
    context: Record<string, any> = {},
  ) {
    scope =
      scope instanceof ResourceScopeDto
        ? scope
        : (plainToInstance(ResourceScopeDto, scope) as ResourceScopeDto);

    this.take = scope.limit ?? DEFAULT_LIMIT;
    this.skip = ((scope.page ?? DEFAULT_PAGE) - 1) * (this.take || 0);
    this.withDeleted = !!scope.trash;

    if (this.withDeleted)
      scope.notnull = scope.notnull
        ? `${scope.notnull}${PAIRS_SEPARATOR}deletedAt`
        : 'deletedAt';

    if (scope.order) {
      const [key, value] = scope.order.split(PAIR_SEPARATOR);
      this.addOrder(key.split(KEYS_SEPARATOR), value.toUpperCase());
    }

    const where = this.buildWhere(scope, relations, context);

    if (strategy == 'OR') this.where = [...this.where, where];
    else if (strategy == 'AND') {
      this.where = this.where.length
        ? this.where.map((w) => this.mergeWhere(w, where))
        : [where];
    }
  }

  public toOptions(): ResourceScopeOptions {
    return {
      where: this.where,
      order: this.order,
      withDeleted: this.withDeleted,
    };
  }

  public toPageOptions(): ResourceScopePageOptions {
    return {
      where: this.where,
      order: this.order,
      skip: this.skip,
      take: this.take,
      withDeleted: this.withDeleted,
    };
  }

  private buildWhere(
    scope: ResourceScopeDto,
    relations: string[] | 'auto' = [],
    context: Record<string, any> = {},
  ) {
    const where: ResourceScopeOptions['where'][number] = {};

    for (const clause of Object.keys(
      ResourceScopeClauseOperator,
    ) as ClauseOperator[]) {
      const pairs = scope[clause];
      if (pairs === undefined || typeof pairs !== 'string') continue;

      pairs.split(PAIRS_SEPARATOR).forEach((pair) => {
        const [key, value] = pair.split(PAIR_SEPARATOR);
        const keys = key.split(KEYS_SEPARATOR);
        if (keys.length > 1) {
          const relationKeys = keys.slice(0, -1);
          if (
            relations !== 'auto' &&
            (!relations.length ||
              !relations.includes(relationKeys.join(KEYS_SEPARATOR)))
          )
            return;
        }

        const resolvedValue = value ? this.resolveContext(value, context) : '';
        this.addWhere(
          where,
          keys,
          ResourceScopeClauseOperator[clause](resolvedValue),
        );
      });
    }

    return where;
  }

  private addWhere(
    target: ResourceScopeOptions['where'][number],
    path: string[],
    value: FindOperator<any> | string,
  ) {
    const [head, ...rest] = path;

    if (rest.length === 0) {
      if (value instanceof FindOperator)
        target[head] = target[head] ? And(target[head], value) : value;
      else {
        target[head] = value;
      }
      return;
    }

    if (!target[head] || target[head] instanceof FindOperator) {
      target[head] = {};
    }
    this.addWhere(target[head], rest, value);
  }

  private mergeWhere(
    base: ResourceScopeOptions['where'][number],
    filler: ResourceScopeOptions['where'][number],
  ): ResourceScopeOptions['where'][number] {
    const result = { ...base };

    for (const key in filler) {
      const valBase = result[key];
      const valFiller = filler[key];

      if (valBase == null) {
        result[key] = valFiller;
      } else if (valFiller == null) {
        continue;
      } else if (
        typeof valBase === 'object' &&
        !(valBase instanceof FindOperator) &&
        typeof valFiller === 'object' &&
        !(valFiller instanceof FindOperator)
      ) {
        result[key] = this.mergeWhere(valBase, valFiller);
      } else {
        const arrBase =
          valBase instanceof FindOperator && valBase.type === 'and'
            ? valBase.value
            : [valBase];
        const arrFiller =
          valFiller instanceof FindOperator && valFiller.type === 'and'
            ? valFiller.value
            : [valFiller];

        result[key] = And(...arrBase, ...arrFiller);
      }
    }

    return result;
  }

  private addOrder(keys: string[], value: string) {
    let current = this.order;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (i === keys.length - 1) {
        if (typeof current[key] !== 'object' || current[key] === null)
          current[key] = value;
      } else {
        if (typeof current[key] !== 'object' || current[key] === null)
          current[key] = {};

        current = current[key];
      }
    }
  }

  private resolveContext(str: string, context: Record<string, any>): string {
    return str
      .split(VALUES_SEPARATOR)
      .map((value) =>
        value.replace(
          /^\$([a-zA-Z_$][\w$]*(?:\.[a-zA-Z_$][\w$]*)*)$/,
          (_, path: string) =>
            String(
              path
                .split('.')
                .reduce<any>((value, key) => value?.[key], context) ?? '',
            ),
        ),
      )
      .join(',');
  }
}
