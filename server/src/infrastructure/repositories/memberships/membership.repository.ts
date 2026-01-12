import {
  IMembershipRepository,
  MembershipsFilters,
} from "../../../application/repositories/memberships-repository.interface";
import { Membership } from "../../../domain/entities/membership";
import { prisma } from "../../../lib/prisma";
import { BaseRepository } from "../base.repository";
import { Prisma } from "../../../generated/prisma/client";

export class MembershipRepository
  extends BaseRepository<Membership, MembershipsFilters>
  implements IMembershipRepository
{
  constructor() {
    super(prisma.membership as any);
  }

  async buildQueryFilters(
    filters: MembershipsFilters
  ): Promise<Record<string, unknown>> {
    const whereClause: Record<string, unknown> = {};

    if (filters.search) {
      const searchTerms = filters.search.trim().split(/\s+/).filter(Boolean);

      if (searchTerms.length > 0) {
        whereClause.AND = searchTerms.map((term) => ({
          OR: [
            { member: { firstName: { contains: term } } },
            { member: { lastName: { contains: term } } },
            { member: { email: { contains: term } } },
            { member: { docNumber: { contains: term } } },
            { plan: { name: { contains: term } } },
          ],
        }));
      }
    }
    return whereClause;
  }

  findActiveByMemberId(memberId: string): Prisma.PrismaPromise<Membership> {
    return prisma.membership.findFirst({
      where: {
        memberId: memberId,
        status: "ACTIVE",
      },
      include: {
        plan: true,
      },
    }) as any;
  }
}
