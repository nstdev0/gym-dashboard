import { User } from "../entities/user";

export type CreateUserDTO = Omit<User, "id" | "createdAt" | "updatedAt">; // TODO: Revisar si esto esta completamente bien

export type UpdateUserDTO = Partial<CreateUserDTO>;
