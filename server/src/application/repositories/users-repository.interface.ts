import { User } from "../../domain/entities/user";
import { IBaseRepository } from "./base-repository.interface";

export type UsersFilters = {
  search?: string | null;
  role?: string | null;
};

export interface IUsersRepository extends IBaseRepository<User, UsersFilters> {}
