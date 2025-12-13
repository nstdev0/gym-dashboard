// import { db } from "../../../database/db";
// import { type Member } from "../../../domain/entities/member";
// import { type RowDataPacket } from 'mysql2';

// export class MembersRepository {
//     allMembers = async ():Promise<Member[]> => {
//         const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM members');
//         return rows as Member[];
//     }

//     memberById = async (id: number):Promise<Member> => {
//         const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM members WHERE id = ?', [id]);
//         if (rows.length === 0) {
//             throw new Error("Member not found");
//         }
//         return rows[0] as Member;
//     }
// }

import { CreateMemberDTO, UpdateMemberDTO } from "../../../domain/DTOs/member";
import { Member } from "../../../domain/entities/member";
import { DocType } from "../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";
import { BaseRepository } from "../base.repository";

export class MemberRepository extends BaseRepository<Member, string> {
  constructor() {
    super(prisma.member);
  }

  async create(data: CreateMemberDTO): Promise<Member> {
    return await prisma.member.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        birthDate: new Date(data.birthDate),
        height: data.height,
        weight: data.weight,
        docType: data.docType,
        docNumber: data.docNumber,
        phoneNumber: data.phoneNumber,
      },
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
}
