import { useMemo, useState, useCallback } from 'react';
import type {
  ConditionKey,
  ConditionValue,
  ResourceQueryState,
} from '../resource-query.type';
import { buildParams } from '../resource-query.util';

type FieldPatch<K extends keyof ResourceQueryState = keyof ResourceQueryState> =
  {
    type: 'set';
    key: K;
    value: ResourceQueryState[K];
  };

type ConditionPatch = {
  type: 'add' | 'del';
  key: ConditionKey;
  field: string;
  value?: ConditionValue;
};

type Patch = FieldPatch | ConditionPatch;

function useResourceQuery(initial: ResourceQueryState = {}) {
  const [state, setState] = useState<ResourceQueryState>(initial);

  const set = useCallback(
    <K extends keyof ResourceQueryState>(
      key: K,
      value: ResourceQueryState[K]
    ) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const add = useCallback(
    (key: ConditionKey, field: string, value: ConditionValue) => {
      setState((prev) => ({
        ...prev,
        [key]: { ...prev[key], [field]: value },
      }));
    },
    []
  );

  const del = useCallback((key: ConditionKey, field: string) => {
    setState((prev) => {
      const map = { ...prev[key] };
      delete map[field];
      return { ...prev, [key]: map };
    });
  }, []);

  const batch = useCallback((patches: Patch[]) => {
    setState((prev) => {
      let next = { ...prev };

      for (const patch of patches) {
        if (patch.type === 'set') {
          next = { ...next, [patch.key]: patch.value };
        } else if (patch.type === 'add') {
          next = {
            ...next,
            [patch.key]: { ...next[patch.key], [patch.field]: patch.value },
          };
        } else if (patch.type === 'del') {
          const map = { ...next[patch.key] };
          delete map[patch.field];
          next = { ...next, [patch.key]: map };
        }
      }

      return next;
    });
  }, []);

  const reset = useCallback(() => setState({ limit: 10, page: 1 }), []);

  const params = useMemo(() => buildParams(state), [state]);

  return {
    state,
    set,
    add,
    del,
    batch,
    reset,
    params,
  };
}

export { useResourceQuery };
