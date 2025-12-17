export interface IBaseRepository<T, Id> {
  findAll(): Promise<T[]>;
  findById(id: Id): Promise<T | null>;
  create(data: any): Promise<T>;
  update(id: Id, data: any): Promise<T | null>;
  delete(id: Id): Promise<T | null>;
}
