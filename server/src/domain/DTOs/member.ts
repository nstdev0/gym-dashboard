import { DocType, Gender } from "../../generated/prisma/enums";

export interface CreateMemberDTO {
  firstName: string;
  lastName: string;
  gender: Gender;
  birthDate: Date;
  height: number;
  weight: number;
  docType: DocType;
  docNumber: string;
  phoneNumber: string;
}

export interface UpdateMemberDTO {
  firstName?: string | null;
  lastName?: string | null;
  gender?: Gender | null;
  birthDate?: Date;
  height?: number | null;
  weight?: number | null;
  phoneNumber?: string | null;
}
