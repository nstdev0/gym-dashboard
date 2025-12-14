import { Role } from "../../generated/prisma/enums";

export interface CreateUserDTO {
  role: Role;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserDTO {
  role?: Role | null;
  firstName?: string | null;
  lastName?: string | null;
  userName?: string | null;
  email?: string | null;
  password?: string | null;
}
