export const DocType = {
  DNI: "DNI",
  PASSPORT: "PASSPORT",
  CE: "CE",
} as const;
export type DocType = (typeof DocType)[keyof typeof DocType];

export const Gender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
} as const;
export type Gender = (typeof Gender)[keyof typeof Gender];

export type Member = {
  id: string;

  firstName: string;
  lastName?: string;
  gender: Gender;
  birthDate: Date;
  height: number;
  weight: number;

  docType: DocType;
  docNumber: string;
  phoneNumber: string;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
};
