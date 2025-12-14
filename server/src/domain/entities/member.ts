import { DocType, Gender } from "../../generated/prisma/enums";

export type Member = {
  id: number;
  firstName: string;
  lastName: string;
  gender: Gender;
  birthDate: Date;
  height: number;
  weight: number;
  docType: DocType;
  docNumber: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
};
