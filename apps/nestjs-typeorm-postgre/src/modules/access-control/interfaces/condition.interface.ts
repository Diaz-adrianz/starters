export const OPERATORS = [
  'eq',
  'neq',
  'lt',
  'lte',
  'gt',
  'gte',
  'in',
  'nin',
] as const;

export type Operator = (typeof OPERATORS)[number];

export type Scalar = string | number | boolean | Date | null;

export type Condition = Record<
  string,
  Partial<Record<Operator, Scalar | Scalar[]>>
>;
