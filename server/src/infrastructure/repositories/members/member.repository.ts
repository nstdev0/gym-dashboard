import { IPageableRequest } from "../../../application/repositories/base-repository.interface";
import { Member } from "../../../domain/entities/member";
import { DocType } from "../../../domain/enums/doctype.enum";
import { prisma } from "../../../lib/prisma";
import { BaseRepository } from "../base.repository";

export interface MemberFilters {
  search?: string;
  isActive?: boolean;
}

export class MemberRepository extends BaseRepository<Member, MemberFilters> {
  constructor() {
    super(prisma.member);
  }

  async findAll(request: IPageableRequest<MemberFilters>): Promise<Member[]> {
    return this.model.findMany({
      include: {
        memberships: {
          where: {
            status: "ACTIVE",
          },
          include: {
            plan: true,
          },
        },
      },
      skip: (request.page - 1) * request.pageSize,
      take: request.pageSize,
    });
  }

  async findUniqueDocument(documentData: {
    docType: DocType;
    docNumber: string;
  }): Promise<Member | null> {
    const matchDocument = await prisma.member.findUnique({
      where: {
        docType_docNumber: {
          docType: documentData.docType,
          docNumber: documentData.docNumber,
        },
      },
    });
    return matchDocument;
  }

  async isActive(memberId: string): Promise<boolean> {
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      select: { isActive: true },
    });
    return member ? member.isActive : false;
  }
}
