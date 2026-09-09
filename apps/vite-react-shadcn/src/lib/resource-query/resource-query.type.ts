export type ConditionValue = string | number | boolean | Array<string | number>;

export interface ConditionMap {
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

export type ConditionKey = Extract<
  keyof ResourceQueryState,
  'search' | 'starts' | 'where' | 'in' | 'nin' | 'gte' | 'lte' | 'between'
>;
export type ListKey = Extract<keyof ResourceQueryState, 'isnull' | 'notnull'>;
