import { DocType, Member } from "../../../domain/entities/member";
import { prisma } from "../../../lib/prisma";
import { BaseRepository } from "../base.repository";

export class MemberRepository extends BaseRepository<Member, string> {
  constructor() {
    super(prisma.member);
  }

  async findAll(): Promise<Member[]> {
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
      orderBy: {
        lastName: 'asc',
      }
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
