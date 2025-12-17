import { CreateUserDTO, UpdateUserDTO } from "../../../domain/DTOs/user";
import { Member } from "../../../domain/entities/member";
import { User } from "../../../domain/entities/user";
import { UserRepository } from "../../../infrastructure/repositories/users/user.repository";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  findAll = async (): Promise<User[]> => {
    const users = await this.userRepository.findAll();
    return users;
  };

  create = async (data: CreateUserDTO): Promise<User> => {
    const existinUserEmail = await this.userRepository.findByEmail(data.email);
    const existingUserUsername = await this.userRepository.findByUsername(
      data.username
    );

    if (existinUserEmail) {
      throw new Error(`Ya existe un usuario con el correo: ${data.email}`);
    }
    if (existingUserUsername) {
      throw new Error(
        `Ya existe un usuario con el nombre de usuario: ${data.username}`
      );
    }
    return await this.userRepository.create(data);
  };

  findById = async (id: string): Promise<User | null> => {
    const user = await this.userRepository.findById(id);
    return user;
  };

  update = async (id: string, data: UpdateUserDTO): Promise<User | null> => {
    const updatedUser = await this.userRepository.update(id, data);
    return updatedUser;
  };

  delete = async (id: string): Promise<User | null> => {
    const deletedUser = await this.userRepository.delete(id);
    return deletedUser;
  };
}
