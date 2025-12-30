import {
  PrismaModelDelegate,
  IBaseRepository,
  IPageableRequest,
} from "../../application/repositories/base-repository.interface";
import { prisma } from "../../lib/prisma"; // Ajusta tu import de prisma
import { AppError } from "../../domain/errors/app-error";
import { IPageableResult } from "../../application/common/pagination";

export abstract class BaseRepository<TEntity, TFilters>
  implements IBaseRepository<TEntity, TFilters>
{
  constructor(protected readonly model: PrismaModelDelegate<TEntity>) {}

  abstract buildQueryFilters(
    filters: TFilters
  ): Promise<Record<string, unknown>>;

  async findAll(
    request?: IPageableRequest<TFilters>,
    includes?: Record<string, unknown>
  ): Promise<IPageableResult<TEntity>> {
    try {
      const page = request?.page;
      const pageSize = request?.pageSize;

      const isPaginationEnabled = page !== undefined && pageSize !== undefined;

      const skip = isPaginationEnabled ? (page - 1) * pageSize : undefined;
      const take = isPaginationEnabled ? pageSize : undefined;

      let whereClause: any = {};
      if (request?.filters) {
        const dynamicFilters = await this.buildQueryFilters(request.filters);
        whereClause = { ...whereClause, ...dynamicFilters };
      }

      const [total, data] = await prisma.$transaction([
        this.model.count({ where: whereClause }),
        this.model.findMany({
          where: whereClause,
          take: take,
          skip: skip,
          include: includes,
          orderBy: { createdAt: "desc" },
        }),
      ]);

      const totalPages = isPaginationEnabled ? Math.ceil(total / pageSize) : 1;

      return {
        totalRecords: total,
        currentPage: page || 1,
        pageSize: pageSize || total,
        totalPages: totalPages,
        hasNext: isPaginationEnabled ? page * pageSize < total : false,
        hasPrevious: isPaginationEnabled ? page > 1 : false,
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

  async findUnique(where: Record<string, unknown>): Promise<TEntity | null> {
    try {
      return await this.model.findUnique({ where: where });
    } catch (error) {
      this.handleError(error);
    }
  }

  async create(data: any): Promise<TEntity> {
    try {
      return await this.model.create({ data });
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: string, data: any): Promise<TEntity | null> {
    try {
      return await this.model.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(id: string): Promise<TEntity> {
    try {
      return await this.model.delete({
        where: { id },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  protected handleError(error: any): never {
    if (error?.code === "P2002") {
      // Extract constraint name if available, otherwise use a generic message
      const constraint = error.meta?.target ? error.meta.target.join(', ') : 'unique';
      throw new AppError(
        `Unique constraint failed on the ${constraint} constraint`,
        409,
        "UNIQUE_CONSTRAINT"
      );
    }
    if (error?.code === "P2003") {
      throw new AppError(
        "No se puede eliminar este registro porque tiene relaciones activas (ej. facturas, membresías).",
        400,
        "CONSTRAINT_VIOLATION"
      );
    }
    if (error?.code === "P2025") {
      throw new AppError("Registro no encontrado.", 404, "NOT_FOUND");
    }

    console.error("Repository Error:", error);
    // Handle cleanup for other potential Prisma errors or generic errors
    throw new AppError(
      error instanceof Error ? error.message : "Error en la operación de base de datos.",
      500,
      "DB_ERROR"
    );
  }
}
