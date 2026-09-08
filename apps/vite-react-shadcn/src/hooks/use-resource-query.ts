import type { ApiParams } from '@/lib/axios/api.type';
import { useMemo, useState, useCallback } from 'react';

// ======================================
// Types
// --------------------------------------
type ConditionValue = string | number | boolean | Array<string | number>;

interface ConditionMap {
  [field: string]: ConditionValue;
}

export interface ResourceQueryState {
  search?: ConditionMap;
  starts?: ConditionMap;
  where?: ConditionMap;
  in?: ConditionMap;
  nin?: ConditionMap;
  gte?: ConditionMap;
  lte?: ConditionMap;
  between?: ConditionMap;
  isnull?: string[];
  notnull?: string[];
  order?: Record<string, 'asc' | 'desc'>;
  limit?: number;
  page?: number;
  trash?: boolean;
}

type ConditionKey = Extract<
  keyof ResourceQueryState,
  'search' | 'starts' | 'where' | 'in' | 'nin' | 'gte' | 'lte' | 'between'
>;
type ListKey = Extract<keyof ResourceQueryState, 'isnull' | 'notnull'>;

// ======================================
// Constants
// --------------------------------------
const CONDITION_SEPARATOR = ':';
const SCOPE_SEPARATOR = ';';
const VALUES_SEPARATOR = ',';

// ======================================
// Utils
// --------------------------------------
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

// ======================================
// Hook
// --------------------------------------
export const useResourceQuery = (initial: ResourceQueryState = {}) => {
  const [state, setState] = useState<ResourceQueryState>(initial);

  const setField = useCallback(
    <K extends keyof ResourceQueryState>(
      key: K,
      value: ResourceQueryState[K]
    ) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const addCondition = useCallback(
    (key: ConditionKey, field: string, value: ConditionValue) => {
      setState((prev) => ({
        ...prev,
        [key]: { ...prev[key], [field]: value },
      }));
    },
    []
  );

  const remCondition = useCallback((key: ConditionKey, field: string) => {
    setState((prev) => {
      const map = { ...prev[key] };
      delete map[field];
      return { ...prev, [key]: map };
    });
  }, []);

  const addListItem = useCallback((key: ListKey, field: string) => {
    setState((prev) => {
      const list = prev[key] ?? [];
      if (list.includes(field)) return prev;
      return { ...prev, [key]: [...list, field] };
    });
  }, []);

  const remListItem = useCallback((key: ListKey, field: string) => {
    setState((prev) => ({
      ...prev,
      [key]: (prev[key] ?? []).filter((f) => f !== field),
    }));
  }, []);

  const addOrder = useCallback((field: string, dir: 'asc' | 'desc') => {
    setState((prev) => ({
      ...prev,
      order: { ...prev.order, [field]: dir },
    }));
  }, []);

  const remOrder = useCallback((field: string) => {
    setState((prev) => {
      const order = { ...prev.order };
      delete order[field];
      return { ...prev, order };
    });
  }, []);

  const reset = useCallback(() => setState({ limit: 10, page: 1 }), []);

  const params = useMemo(() => {
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
  }, [state]);

  return {
    state,
    setField,
    addCondition,
    remCondition,
    addListItem,
    remListItem,
    addOrder,
    remOrder,
    reset,
    params,
  };
};
