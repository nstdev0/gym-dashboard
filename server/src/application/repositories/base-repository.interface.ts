export interface IBaseRepository<TEntity, TFilters> {
  findAll(request: IPageableRequest<TFilters>): Promise<TEntity[]>;
  findById(id: string): Promise<TEntity | null>;
  create(data: any): Promise<TEntity>;
  update(id: string, data: any): Promise<TEntity | null>;
  delete(id: string): Promise<TEntity | null>;
}

export interface IPageableRequest<TFilters = Record<string, unknown>> {
  page: number;
  pageSize: number;
  filters?: TFilters;
}
