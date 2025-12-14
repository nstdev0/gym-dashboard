import { MemberRepository } from "../../../infrastructure/repositories/members/member.repository";
import { Member } from "../../../domain/entities/member";
import { CreateMemberDTO, UpdateMemberDTO } from "../../../domain/DTOs/member";

export class MembersService {
  constructor(private membersRepository: MemberRepository) {}

  findAll = async (): Promise<Member[]> => {
    const members = await this.membersRepository.findAll();
    return members;
  };

  create = async (data: CreateMemberDTO): Promise<Member> => {
    const existingMemberDocument =
      await this.membersRepository.findUniqueDocument({
        docNumber: data.docNumber,
        docType: data.docType,
      });

    if (existingMemberDocument) {
      throw new Error(
        `Ya existe un miembro con ${data.docType}: ${data.docNumber} `
      );
    }

    const isDNI = data.docType === "DNI";
    if (isDNI && data.docNumber.length !== 8) {
      throw new Error("El número de DNI debe tener 8 dígitos.");
    }

    const isPassport = data.docType === "PASSPORT";
    if (
      isPassport &&
      (data.docNumber.length < 6 || data.docNumber.length > 9)
    ) {
      throw new Error("El número de pasaporte debe tener entre 6 y 9 dígitos.");
    }

    const isCE = data.docType === "CE";
    if (isCE && (data.docNumber.length < 7 || data.docNumber.length > 12)) {
      throw new Error(
        "El número de Carnet de Extranjería debe tener entre 7 y 12 dígitos."
      );
    }

    const newMember = await this.membersRepository.create(data);
    return newMember;
  };

  findById = async (id: string): Promise<Member | null> => {
    const member = await this.membersRepository.findById(id);
    return member;
  };

  update = async (
    id: string,
    data: UpdateMemberDTO
  ): Promise<Member | null> => {
    const updatedMember = await this.membersRepository.update(id, data);
    return updatedMember;
  };

  delete = async (id: string): Promise<Member | null> => {
    const deletedMember = await this.membersRepository.delete(id);
    return deletedMember;
  };
}
