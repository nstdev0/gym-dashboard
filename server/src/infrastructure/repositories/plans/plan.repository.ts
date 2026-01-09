import z from "zod";
import {
  IPlansRepository,
  PlansFilters,
} from "../../../application/repositories/plans-repository.interface";
import { Plan } from "../../../domain/entities/plan";
import { prisma } from "../../../lib/prisma";
import { BaseRepository } from "../base.repository";

export class PlanRepository
  extends BaseRepository<Plan, PlansFilters>
  implements IPlansRepository
{
  constructor() {
    super(prisma.plan as any);
  }

  async buildQueryFilters(
    filters: PlansFilters
  ): Promise<Record<string, unknown>> {
    const whereClause: Record<string, unknown> = {};

    if (filters.search) {
      const searchTerms = filters.search.trim().split(/\s+/).filter(Boolean);

      if (searchTerms.length > 0) {
        whereClause.AND = searchTerms.map((term) => ({
          name: { contains: term },
        }));
      }
    }

    if (filters.isActive !== undefined && filters.isActive !== null) {
      whereClause.isActive = filters.isActive;
    }

    return whereClause;
  }

  async findByName(name: string): Promise<Plan | null> {
    return (await prisma.plan.findFirst({
      where: { name },
    })) as any;
  }
}
