import { Membership } from "../../../domain/entities/membership";
import { prisma } from "../../../lib/prisma";
import { BaseRepository } from "../base.repository";

export class MembershipRepository extends BaseRepository<Membership> {
  constructor() {
    super(prisma.membership);
  }

  async findAll(): Promise<Membership[]> {
    return this.model.findMany({
      include: {
        member: true,
        plan: true,
      },
    });
  }

  async findActiveByMemberId(memberId: string) {
    return prisma.membership.findMany({
      where: {
        memberId: memberId,
        status: "ACTIVE",
        endDate: { gte: new Date() }, // Que no haya vencido hoy
      },
      include: {
        plan: true, // Traemos info del plan
      },
    });
  }
}
