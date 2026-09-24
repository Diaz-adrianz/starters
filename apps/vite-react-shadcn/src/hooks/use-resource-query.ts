import type {
  ConditionKey,
  ConditionValue,
  ResourceQueryState,
} from '@/lib/resource-query/resource-query.type';
import { buildParams } from '@/lib/resource-query/resource-query.util';
import { useMemo, useState, useCallback } from 'react';

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
    addOrder,
    remOrder,
    reset,
    params,
  };
};
