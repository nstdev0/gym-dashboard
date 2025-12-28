export interface IPageableRequest<TFilters = Record<string, unknown>> {
  page: number;
  pageSize: number;
  filters?: TFilters;
}

export interface IPageableResult<T> {
  records: T[];
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
