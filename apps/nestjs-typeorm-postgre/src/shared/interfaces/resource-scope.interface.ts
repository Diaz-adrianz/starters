export interface ResourceScopeIntf {
  search?: string;
  starts?: string;
  where?: string;
  in?: string;
  nin?: string;
  isnull?: string;
  notnull?: string;
  gte?: string;
  lte?: string;
  between?: string;
  limit?: number;
  page?: number;
  order?: string;
  trash?: boolean;
}
