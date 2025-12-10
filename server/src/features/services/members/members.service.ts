import { MembersRepository } from "../../../infraestructure/repositories/members/members.repository";
import { Member } from "../../../domain/entities/member";

export class MembersService {
    constructor (private membersRepository: MembersRepository) {}

    allMembers = async ():Promise<Member[]> => {
        const members = await this.membersRepository.allMembers()
        return members
    }

    memberById = async (id: number):Promise<Member> => {
        const member = await this.membersRepository.memberById(id)
        return member
    }
}