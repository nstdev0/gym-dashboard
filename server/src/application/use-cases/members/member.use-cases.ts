import {
  Member,
  MemberInsert,
  MemberUpdate,
} from "../../../domain/entities/member";
import { IPageableResult } from "../../common/pagination";
import {
  IMembersRepository,
  MembersFilters,
} from "../../repositories/members-repository.interface";

export class MembersService {
  constructor(private membersRepository: IMembersRepository) {}

  findAll = async (request: {
    page: number;
    pageSize: number;
    filters?: MembersFilters;
  }): Promise<IPageableResult<Member>> => {
    const includes = {
      memberships: {
        where: {
          status: "ACTIVE",
        },
        include: {
          plan: true,
        },
      },
    };
    try {
      const response = await this.membersRepository.findAll(request, includes);
      if (!response) {
        throw new Error("No members found");
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  create = async (data: MemberInsert): Promise<Member> => {
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

    return await this.membersRepository.create(data);
  };

  findById = async (id: string): Promise<Member | null> => {
    const includes = {
      memberships: {
        where: {
          status: "ACTIVE",
        },
        include: {
          plan: true,
        },
      },
    };
    return await this.membersRepository.findById(id, includes);
  };

  update = async (id: string, data: MemberUpdate): Promise<Member | null> => {
    return await this.membersRepository.update(id, data);
  };

  delete = async (id: string): Promise<Member | null> => {
    return await this.membersRepository.delete(id);
  };
}
