import {
  IMembersRepository,
  MembersFilters,
} from "../../../application/repositories/members-repository.interface";
import { Member } from "../../../domain/entities/member";
import { DocType } from "../../../domain/enums/doctype.enum";
import { prisma } from "../../../lib/prisma";
import { BaseRepository } from "../base.repository";

export class MemberRepository
  extends BaseRepository<Member, MembersFilters>
  implements IMembersRepository
{
  constructor() {
    super(prisma.member);
  }

  async buildQueryFilters(
    filters: MembersFilters
  ): Promise<Record<string, unknown>> {
    const whereClause: Record<string, unknown> = {};

    if (filters.search) {
      whereClause.OR = [
        { firstName: { contains: filters.search } },
        { lastName: { contains: filters.search } },
        { email: { contains: filters.search } },
      ];
    }

    return whereClause;
  }

  async findUniqueDocument(documentData: {
    docType: DocType;
    docNumber: string;
  }): Promise<boolean> {
    const matchDocument = await prisma.member.findUnique({
      where: {
        docType_docNumber: {
          docType: documentData.docType,
          docNumber: documentData.docNumber,
        },
      },
    });
    return matchDocument ? true : false;
  }

  async isActive(id: string): Promise<boolean> {
    const member = await prisma.member.findUnique({
      where: { id },
      select: { isActive: true },
    });
    return member ? member.isActive : false;
  }
}
