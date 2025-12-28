import {
  User,
  UserCreateInput,
  UserUpdateInput,
} from "../../../domain/entities/user";
import { IPageableResult } from "../../common/pagination";
import {
  IUsersRepository,
  UsersFilters,
} from "../../repositories/users-repository.interface";

// import bcrypt from "bcrypt"; // Should be injected or util

export class UsersService {
  constructor(private usersRepository: IUsersRepository) {}

  findAll = async (request: {
    page: number;
    pageSize: number;
    filters?: UsersFilters;
  }): Promise<IPageableResult<User>> => {
    try {
      const response = await this.usersRepository.findAll(request);
      if (!response) {
        throw new Error("No users found");
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  create = async (data: UserCreateInput): Promise<User> => {
    const existingUser = await this.usersRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error(`Ya existe un usuario con el email: ${data.email}`);
    }

    // TODO: Hash password here if not handled elsewhere or by middleware
    // const hashedPassword = await bcrypt.hash(data.password, 10);
    // const userData = { ...data, password: hashedPassword };
    
    // For now assuming direct pass or handled lower
    return await this.usersRepository.create(data);
  };

  findById = async (id: string): Promise<User | null> => {
    return await this.usersRepository.findById(id);
  };

  update = async (id: string, data: UserUpdateInput): Promise<User | null> => {
     // Optional: Check email uniqueness if email is changed
    return await this.usersRepository.update(id, data);
  };

  delete = async (id: string): Promise<User | null> => {
    return await this.usersRepository.delete(id);
  };
}
