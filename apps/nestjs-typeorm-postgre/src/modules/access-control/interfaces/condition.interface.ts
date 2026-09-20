type Operator = 'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte' | 'in' | 'nin';

type Scalar = string | number | boolean | Date;

export type Condition = Record<string, Record<Operator, Scalar | Scalar[]>>;
