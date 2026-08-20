export const Operator = {
  SEARCH: 'search',
  STARTS: 'starts',
  WHERE: 'where',
  IN: 'in',
  NIN: 'nin',
  IS_NULL: 'isnull',
  NOT_NULL: 'notnull',
  GTE: 'gte',
  LTE: 'lte',
  BETWEEN: 'between',
} as const;

export type Operator = (typeof Operator)[keyof typeof Operator];

export type Condition =
  | {
      field: string;
      op: 'search' | 'starts';
      value: string;
    }
  | {
      field: string;
      op: 'where';
      value: string | number | boolean;
    }
  | {
      field: string;
      op: 'in' | 'nin';
      value: (string | number | Date)[];
    }
  | {
      field: string;
      op: 'isnull' | 'notnull';
    }
  | {
      field: string;
      op: 'gte' | 'lte';
      value: string | number | Date;
    }
  | {
      field: string;
      op: 'between';
      value: (string | number | Date)[];
    };

export type Scope = Condition[];

export type ScopeContext = Record<string, any>;

export type OrderDir = 'asc' | 'desc';

export type NestedFields = '*' | string[];

export type JoinStrategy = 'and' | 'or';
