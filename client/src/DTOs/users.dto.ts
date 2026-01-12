import { RoleEnum } from "../types/enums";

export interface User {
  id: string;
  firstName: string;
  lastName?: string | null;
  username?: string | null;
  email: string;
  role: RoleEnum;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  firstName: string;
  lastName?: string | null;
  username?: string | null;
  email: string;
  password?: string | null;
  role?: RoleEnum;
  isActive?: boolean;
}

export type UpdateUserDto = Partial<CreateUserDto>;
