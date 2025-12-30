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
import bcrypt from "bcrypt";
import { NotFoundError } from "../../../domain/errors/not-found-error";
import { AppError } from "../../../domain/errors/app-error";

const salt = await bcrypt.genSalt(10);

export class UsersService {
  constructor(private usersRepository: IUsersRepository) {}

  findAll = async (request: {
    page?: number | undefined;
    pageSize?: number | undefined;
    filters?: UsersFilters;
  }): Promise<IPageableResult<User>> => {
    try {
      const response = await this.usersRepository.findAll(request);
      if (!response) {
        throw new NotFoundError("No users found");
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  create = async (data: UserCreateInput): Promise<User> => {
    const existingEmail = await this.usersRepository.findUnique({
      email: data.email,
    });

    if (existingEmail) {
      throw new AppError(
        `Ya existe un usuario con el email: ${data.email}`,
        409,
        "USER_ALREADY_EXISTS"
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userData = { ...data, password: hashedPassword };

    return await this.usersRepository.create(userData);
  };

  findById = async (id: string): Promise<User | null> => {
    return await this.usersRepository.findById(id);
  };

  update = async (id: string, data: UserUpdateInput): Promise<User | null> => {
    if (data.email) {
      const existingEmail = await this.usersRepository.findUnique({
        email: data.email,
      });

      if (existingEmail && existingEmail.id !== id) {
        throw new AppError(
          "El email ya está en uso por otro usuario.",
          409,
          "USER_ALREADY_EXISTS"
        );
      }
    }

    if (data.username) {
      const existingUsername = await this.usersRepository.findUnique({
        username: data.username,
      });

      if (existingUsername && existingUsername.id !== id) {
        throw new AppError(
          "El nombre de usuario ya está en uso.",
          409,
          "USER_ALREADY_EXISTS"
        );
      }
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, salt);
    }

    return await this.usersRepository.update(id, data);
  };

  delete = async (id: string): Promise<User | null> => {
    return await this.usersRepository.delete(id);
  };
}
