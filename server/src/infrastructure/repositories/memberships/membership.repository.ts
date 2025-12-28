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
    super(prisma.membership);
  }

  async buildQueryFilters(
    filters: MembershipsFilters
  ): Promise<Record<string, unknown>> {
    const whereClause: Record<string, unknown> = {};

    if (filters.search) {
      whereClause.OR = [
        // Search by member name via relationship
        {
          member: {
            OR: [
              { firstName: { contains: filters.search } },
              { lastName: { contains: filters.search } },
              { docNumber: { contains: filters.search } },
            ]
          }
        },
        // Search by plan name
        {
            plan: {
                name: { contains: filters.search }
            }
        }
      ];
    }

    return whereClause;
  }

  findActiveByMemberId(memberId: string): Prisma.PrismaPromise<Membership> {
    return prisma.membership.findFirst({
        where: {
            memberId: memberId,
            status: "ACTIVE"
        },
        include: {
            plan: true
        }
    }) as any; // Cast as any if type mismatch occurs with PrismaPromise vs Promise in specific versions, or refine type mapping
  }
}
