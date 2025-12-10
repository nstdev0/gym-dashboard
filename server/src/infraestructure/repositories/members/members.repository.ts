import { prisma } from "../../../database/db";
import { type Member } from "../../../domain/entities/member";

export class MembersRepository {
    allMembers = async ():Promise<Member[]> => {
        const members = await prisma.member.findMany()
        return members
    }

    memberById = async (id: number):Promise<Member> => {
        const member = await prisma.member.findUnique({where: {id}})
        if (!member) {
            throw new Error("Member not found");
        }
        return member
    }
}