// Constants
// ------------------------------------
export const QUERY_SEPARATOR = ';';
export const CONDITION_SEPARATOR = ':';
export const FIELDS_SEPARATOR = '.';
export const VALUES_SEPARATOR = ',';

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

// ------------------------------------
export type Operator = (typeof OPERATORS)[number];

export type Condition =
  | {
      field: string;
      op: 'eq' | 'neq';
      value: string | number | boolean | Date | null;
    }
  | {
      field: string;
      op: 'lt' | 'lte' | 'gt' | 'gte';
      value: string | number | Date;
    }
  | {
      field: string;
      op: 'in' | 'nin';
      value: (string | number | Date)[];
    };

export type Query = Condition[];

export type QueryOrder = Record<string, 'asc' | 'desc'>;

export type QuerySearch = Record<string, string>;

// ------------------------------------
export type QueryAllowedFields = '*' | string[];

export type QueryJoin = 'and' | 'or';

export type QueryContext = Record<string, any>;

// Dto
// ------------------------------------
export type QueryDto = Partial<Record<Operator, string>> & {
  search?: string;
  order?: string;
  limit: number;
  page: number;
  trash: boolean;
};

// ORM transformer output
// ----------------------------------------------------------------
export type TypeOrmFindOptions = {
  where: Record<string, any>[];
  order: Record<string, any>;
  withDeleted?: boolean;
  skip?: number;
  take?: number;
};
