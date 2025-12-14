import { Role } from "../../generated/prisma/enums";

export type User = {
  id: number;
  role: Role;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};
