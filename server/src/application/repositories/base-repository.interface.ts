export interface IBaseRepository<T, ID extends string | number> {
    findAll(): Promise<T[]>;
    findById(id: ID): Promise<T | null>;
    create(data: any): Promise<T>;
    update(id: ID, data: any): Promise<T | null>;
    delete(id: ID): Promise<T | null>;
}