import { Plan } from "../../../domain/entities/plan";
import { prisma } from "../../../lib/prisma";
import { BaseRepository } from "../base.repository";

export class PlanRepository extends BaseRepository<Plan, string> {
  constructor() {
    super(prisma.plan);
  }

  async findByName(name: string): Promise<Plan | null> {
    return await prisma.plan.findUnique({
      where: { name },
    });
  }

  async isActive(planId: string): Promise<boolean> {
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
      select: { isActive: true },
    });
    return plan ? plan.isActive : false;
  }
}
