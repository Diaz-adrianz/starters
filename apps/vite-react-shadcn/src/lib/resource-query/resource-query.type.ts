export type ConditionValue =
  string | number | boolean | null | Array<string | number>;

export interface ConditionMap {
  [field: string]: ConditionValue;
}

export interface ResourceQueryState {
  search?: ConditionMap;
  eq?: ConditionMap;
  neq?: ConditionMap;
  lt?: ConditionMap;
  lte?: ConditionMap;
  gt?: ConditionMap;
  gte?: ConditionMap;
  in?: ConditionMap;
  nin?: ConditionMap;
  order?: ConditionMap;
  limit?: number;
  page?: number;
  trash?: boolean;
}

export type ConditionKey = Extract<
  keyof ResourceQueryState,
  'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte' | 'in' | 'nin' | 'order'
>;
