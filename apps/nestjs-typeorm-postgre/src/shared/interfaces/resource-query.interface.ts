import { Operator } from './resource-scope.interface';

export type ResourceQueryIntf = Partial<Record<Operator, string>> & {
  limit?: number;
  page?: number;
  order?: string;
  trash?: boolean;
};
