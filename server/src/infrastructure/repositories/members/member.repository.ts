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

export class MemberRepository {
  async findAll() {
    const members = await prisma.member.findMany();
    return members;
  }

  async create(data: CreateMemberDTO): Promise<Member> {
    const newMember = await prisma.member.create({
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

    return newMember;
  }

  async findById(id: string): Promise<Member | null> {
    const parsedId: number = parseInt(id, 10);

    const member = await prisma.member.findUnique({
      where: { id: parsedId },
    });
    if (!member) return null;

    return member;
  }

  async update(id: string, data: UpdateMemberDTO): Promise<Member | null> {
    const parsedId: number = parseInt(id, 10);
    const updatedMember = await prisma.member.update({
      where: { id: parsedId },
      data: {
        firstName: data.firstName ?? undefined,
        lastName: data.lastName ?? undefined,
        gender: data.gender ? (data.gender as any) : undefined,
        birthDate: data.birthDate ? data.birthDate : undefined,
        height: data.height ?? undefined,
        weight: data.weight ?? undefined,
        phoneNumber: data.phoneNumber ?? undefined,
      },
    });

    if (!updatedMember) return null;
    return updatedMember;
  }

  async delete(id: string): Promise<Member | null> {
    const parsedId: number = parseInt(id, 10);
    const deletedMember = await prisma.member.delete({
      where: { id: parsedId },
    });

    if (!deletedMember) return null;
    return deletedMember;
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

    if (!matchDocument) return null;
    return matchDocument;
  }
}
