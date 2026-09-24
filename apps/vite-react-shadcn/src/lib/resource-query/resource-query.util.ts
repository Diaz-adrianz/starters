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
      const values = Array.isArray(value) ? value : [String(value)];
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

export const buildParams = (state: ResourceQueryState) => {
  const result: ApiParams = {};

  const search = buildConditionString(state.search);
  const eq = buildConditionString(state.eq);
  const neq = buildConditionString(state.neq);
  const lt = buildConditionString(state.lt);
  const lte = buildConditionString(state.lte);
  const gt = buildConditionString(state.gt);
  const gte = buildConditionString(state.gte);
  const in_ = buildConditionString(state.in);
  const nin = buildConditionString(state.nin);
  const order = buildOrderString(state.order);

  if (search) result.search = search;
  if (eq) result.eq = eq;
  if (neq) result.neq = neq;
  if (lt) result.lt = lt;
  if (lte) result.lte = lte;
  if (gt) result.gt = gt;
  if (gte) result.gte = gte;
  if (in_) result.in = in_;
  if (nin) result.nin = nin;
  if (order) result.order = order;
  if (state.limit) result.limit = state.limit;
  if (state.page) result.page = state.page;
  if (state.trash !== undefined) result.trash = state.trash;

  return result;
};
