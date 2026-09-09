import type {
  ConditionKey,
  ConditionValue,
  ListKey,
  ResourceQueryState,
} from '@/lib/resource-query/resource-query.type';
import { buildParams } from '@/lib/resource-query/resource-query.util';
import { useMemo, useState, useCallback } from 'react';

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
    return buildParams(state);
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
