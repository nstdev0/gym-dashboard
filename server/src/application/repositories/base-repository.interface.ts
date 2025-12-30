import { Prisma } from "../../generated/prisma/client";
import { IPageableResult } from "../common/pagination";

// Interface representa los métodos comunes de un Prisma Delegate
export interface PrismaModelDelegate<T> {
  findMany(args?: any): Prisma.PrismaPromise<T[]>;
  findUnique(args?: any): Prisma.PrismaPromise<T | null>;
  create(args: { data: any }): Prisma.PrismaPromise<T>;
  update(args: { where: any; data: any }): Prisma.PrismaPromise<T>;
  delete(args: { where: any }): Prisma.PrismaPromise<T>;
  count(args?: { where?: any }): Prisma.PrismaPromise<number>;
}

export interface IBaseRepository<TEntity, TFilters> {
  buildQueryFilters(filters: TFilters): Promise<Record<string, unknown>>;
  findAll(
    request?: IPageableRequest<TFilters>,
    includes?: Record<string, any>
  ): Promise<IPageableResult<TEntity>>;
  findById(
    id: string,
    includes?: Record<string, unknown>
  ): Promise<TEntity | null>;
  create(data: any): Promise<TEntity>;
  update(id: string, data: any): Promise<TEntity | null>;
  delete(id: string): Promise<TEntity | null>;
  findUnique(where: Record<string, any>): Promise<TEntity | null>;
}

export interface IPageableRequest<TFilters = Record<string, unknown>> {
  page?: number;
  pageSize?: number;
  filters?: TFilters;
}
