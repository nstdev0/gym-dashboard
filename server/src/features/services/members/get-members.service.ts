import { getMembersRepository } from "../../../infraestructure/repositories/members/get-members.repository";

export const getMembersService = async () => {
    return await getMembersRepository();
}