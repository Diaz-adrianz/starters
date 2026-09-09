import type { ApiParams } from '../axios/api.type';
import type { ConditionMap, ResourceQueryState } from './resource-query.type';

export const CONDITION_SEPARATOR = ':';
export const SCOPE_SEPARATOR = ';';
export const VALUES_SEPARATOR = ',';

export const buildConditionString = (
  map?: ConditionMap
): string | undefined => {
  if (!map || Object.keys(map).length === 0) return undefined;

  return Object.entries(map)
    .map(([field, value]) => {
      const values = Array.isArray(value) ? value : [value];
      return `${field}${CONDITION_SEPARATOR}${values.join(VALUES_SEPARATOR)}`;
    })
    .join(SCOPE_SEPARATOR);
};

export const buildOrderString = (
  order?: Record<string, 'asc' | 'desc'>
): string | undefined => {
  if (!order || Object.keys(order).length === 0) return undefined;

  return Object.entries(order)
    .map(([field, dir]) => `${field}${CONDITION_SEPARATOR}${dir}`)
    .join(SCOPE_SEPARATOR);
};

export const buildFieldListString = (fields?: string[]): string | undefined => {
  if (!fields || fields.length === 0) return undefined;
  return fields.join(SCOPE_SEPARATOR);
};

export const buildParams = (state: ResourceQueryState) => {
  const result: ApiParams = {};

  const search = buildConditionString(state.search);
  const starts = buildConditionString(state.starts);
  const where = buildConditionString(state.where);
  const inCond = buildConditionString(state.in);
  const nin = buildConditionString(state.nin);
  const gte = buildConditionString(state.gte);
  const lte = buildConditionString(state.lte);
  const between = buildConditionString(state.between);
  const isnull = buildFieldListString(state.isnull);
  const notnull = buildFieldListString(state.notnull);
  const order = buildOrderString(state.order);

  if (search) result.search = search;
  if (starts) result.starts = starts;
  if (where) result.where = where;
  if (inCond) result.in = inCond;
  if (nin) result.nin = nin;
  if (gte) result.gte = gte;
  if (lte) result.lte = lte;
  if (between) result.between = between;
  if (isnull) result.isnull = isnull;
  if (notnull) result.notnull = notnull;
  if (order) result.order = order;
  if (state.limit) result.limit = state.limit;
  if (state.page) result.page = state.page;
  if (state.trash !== undefined) result.trash = state.trash;

  return result;
};
