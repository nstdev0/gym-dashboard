import {
  IBaseRepository,
  IPageableRequest,
} from "../../application/repositories/base-repository.interface";

// Interface representing the common methods of a Prisma Delegate
export interface Delegate<T> {
  findMany(args?: any): Promise<T[]>;
  findUnique(args: { where: any }): Promise<T | null>;
  create(args: { data: any }): Promise<T>;
  update(args: { where: any; data: any }): Promise<T>;
  delete(args: { where: any }): Promise<T>;
}

import { ConnectionError } from "../../domain/errors/connection-error";
import { AppError } from "../../domain/errors/app-error";

export abstract class BaseRepository<TEntity, TFilters>
  implements IBaseRepository<TEntity, TFilters>
{
  constructor(protected readonly model: Delegate<TEntity>) {}

  async findAll(request: IPageableRequest<TFilters>): Promise<TEntity[]> {
    try {
      return await this.model.findMany({
        skip: (request.page - 1) * request.pageSize,
        take: request.pageSize,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findById(id: string): Promise<TEntity | null> {
    try {
      return await this.model.findUnique({
        where: { id: id },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findUnique(where: Partial<TEntity>): Promise<TEntity | null> {
    try {
      return await this.model.findUnique({
        where,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async create(data: any): Promise<TEntity> {
    try {
      return await this.model.create({
        data,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: string, data: any): Promise<TEntity | null> {
    try {
      return await this.model.update({
        where: { id: id },
        data,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(id: string): Promise<TEntity | null> {
    try {
      return await this.model.delete({
        where: { id: id },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  protected handleError(error: any): never {
    if (error?.code === "P2002") {
      throw new AppError("Unique constraint violation", 409);
    }
    if (error?.code === "P2003") {
      throw new AppError(
        "No se puede eliminar este registro porque tiene relaciones activas (ej. membresias, pagos).",
        400
      );
    }
    if (error?.code === "P2025") {
      throw new AppError("Record not found", 404);
    }
    // Prisma connection errors usually start with P1
    if (error?.code?.startsWith("P1")) {
      throw new ConnectionError("Database connection failed");
    }

    console.error("Repository Error:", error);
    throw new AppError("Database operation failed");
  }
}
