import {
  PrismaModelDelegate,
  IBaseRepository,
  IPageableRequest,
} from "../../application/repositories/base-repository.interface";

import { ConnectionError } from "../../domain/errors/connection-error";
import { AppError } from "../../domain/errors/app-error";
import { IPageableResult } from "../../application/common/pagination";
import { prisma } from "../../lib/prisma";

export abstract class BaseRepository<TEntity, TFilters>
  implements IBaseRepository<TEntity, TFilters>
{
  constructor(protected readonly model: PrismaModelDelegate<TEntity>) {}

  abstract buildQueryFilters(
    filters: TFilters
  ): Promise<Record<string, unknown>>;

  async findAll(
    request: IPageableRequest<TFilters>,
    includes?: any
  ): Promise<IPageableResult<TEntity>> {
    try {
      const safePage = Math.max(1, request.page);
      const safePageSize = Number(request.pageSize);

      let whereClause: any = {};

      if (request.filters) {
        const dynamicFilters = await this.buildQueryFilters(request.filters);
        whereClause = { ...whereClause, ...dynamicFilters };
      }

      const [total, data] = await prisma.$transaction([
        this.model.count({ where: whereClause }),
        this.model.findMany({
          where: whereClause,
          take: safePageSize,
          skip: (safePage - 1) * safePageSize,
          include: includes,
          orderBy: { createdAt: "desc" },
        }),
      ]);

      const totalPages = Math.ceil(total / safePageSize);

      return {
        totalRecords: total,
        currentPage: safePage,
        pageSize: safePageSize,
        totalPages: totalPages,
        hasNext: safePage < totalPages,
        hasPrevious: safePage > 1,
        records: data,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findById(
    id: string,
    includes?: Record<string, unknown>
  ): Promise<TEntity | null> {
    try {
      return await this.model.findUnique({
        where: { id: id },
        include: includes,
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

  async delete(id: string): Promise<TEntity> {
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
      throw new AppError(error?.code, "Unique constraint violation", 409);
    }
    if (error?.code === "P2003") {
      throw new AppError(
        error?.code,
        "No se puede eliminar este registro porque tiene relaciones activas (ej. membresias, pagos).",
        400
      );
    }
    if (error?.code === "P2028") {
      throw new AppError(
        error?.code,
        "Operation timed out. Please try again later.",
        504
      );
    }
    if (error?.code === "P2025") {
      throw new AppError(error?.code, "Record not found", 404);
    }
    // Prisma connection errors usually start with P1
    if (error?.code?.startsWith("P1")) {
      throw new ConnectionError("Database connection failed");
    }

    console.error("Repository Error:", error);
    throw new AppError(error?.code, "Database operation failed");
  }
}
