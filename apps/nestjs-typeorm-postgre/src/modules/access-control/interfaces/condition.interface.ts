export type Operator =
  'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte' | 'in' | 'nin';

type Scalar = string | number | boolean | Date | null;

export type Condition = Record<
  string,
  Partial<Record<Operator, Scalar | Scalar[]>>
>;
