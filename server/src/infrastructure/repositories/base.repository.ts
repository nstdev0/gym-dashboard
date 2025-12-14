import { IBaseRepository } from "../../application/repositories/base-repository.interface";

// Interface representing the common methods of a Prisma Delegate
export interface Delegate<T> {
  findMany(args?: any): Promise<T[]>;
  findUnique(args: { where: any }): Promise<T | null>;
  create(args: { data: any }): Promise<T>;
  update(args: { where: any; data: any }): Promise<T>;
  delete(args: { where: any }): Promise<T>;
}

export abstract class BaseRepository<TEntity, ID extends string | number>
  implements IBaseRepository<TEntity, ID>
{
  constructor(protected readonly model: Delegate<TEntity>) {}

  async findAll(): Promise<TEntity[]> {
    return this.model.findMany();
  }

  async findById(id: ID): Promise<TEntity | null> {
    const parsedId: number = parseInt(id as string, 10);
    return this.model.findUnique({
      where: { id: parsedId },
    });
  }

  async findUnique(where: Partial<TEntity>): Promise<TEntity | null> {
    return this.model.findUnique({
      where,
    });
  }

  async create(data: any): Promise<TEntity> {
    return this.model.create({
      data,
    });
  }

  async update(id: ID, data: any): Promise<TEntity | null> {
    return await this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: ID): Promise<TEntity | null> {
    const parsedId: number = parseInt(id as string, 10);
    return await this.model.delete({
      where: { id: parsedId },
    });
  }
}
