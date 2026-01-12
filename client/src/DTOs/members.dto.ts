import { DocTypeEnum, GenderEnum } from "../types/enums";
import type { Membership } from "./memberships.dto";

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  address?: string | null;
  gender?: GenderEnum | null;
  birthDate?: Date | null;
  height?: number | null;
  weight?: number | null;
  docType: DocTypeEnum;
  docNumber: string;
  phoneNumber?: string | null;
  email?: string | null;
  isActive: boolean;
  memberships?: Membership[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMemberDto {
  firstName: string;
  lastName: string;
  address?: string | null;
  gender?: GenderEnum | null;
  birthDate?: Date | null;
  height?: number | null;
  weight?: number | null;
  docType: DocTypeEnum;
  docNumber: string;
  phoneNumber?: string | null;
  email?: string | null;
  isActive?: boolean;
}

export type UpdateMemberDto = Partial<CreateMemberDto>;
