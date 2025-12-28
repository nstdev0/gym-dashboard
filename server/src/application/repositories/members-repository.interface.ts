import { Member } from "../../domain/entities/member";
import { IBaseRepository } from "./base-repository.interface";

export type MembersFilters = {
  search?: string | null;
};

export interface IMembersRepository
  extends IBaseRepository<Member, MembersFilters> {
  findUniqueDocument(documentData: {
    docType: string;
    docNumber: string;
  }): Promise<boolean>;

  isActive(id: string): Promise<boolean>;
}
