import { Membership } from "../../../domain/entities/membership";
import { prisma } from "../../../lib/prisma";
import { BaseRepository } from "../base.repository";

export class MembershipRepository extends BaseRepository<Membership, string> {
  constructor() {
    super(prisma.membership);
  }

  async findActiveByMemberId(memberId: string) {
    return prisma.membership.findMany({
      where: {
        memberId,
        status: "ACTIVE",
        endDate: { gte: new Date() }, // Que no haya vencido hoy
      },
      include: {
        plan: true, // Traemos info del plan
      },
    });
  }
}
