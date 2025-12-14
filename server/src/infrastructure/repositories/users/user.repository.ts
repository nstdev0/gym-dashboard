import { CreateUserDTO, UpdateUserDTO } from "../../../domain/DTOs/user";
import { User } from "../../../domain/entities/user";
import { prisma } from "../../../lib/prisma";
import { BaseRepository } from "../base.repository";
import bcrypt from "bcrypt";

export class UserRepository extends BaseRepository<User, string> {
  constructor() {
    super(prisma.user);
  }

  saltRounds = 10;

  async create(data: CreateUserDTO): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, this.saltRounds);
    data.password = hashedPassword;
    return this.model.create({ data });
  }

  async update(id: string, data: UpdateUserDTO): Promise<User | null> {
    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, this.saltRounds);
      data.password = hashedPassword;
    }
    return this.model.update({
      where: { id },
      data,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.model.findUnique({
      where: { email },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.model.findUnique({
      where: { username },
    });
  }

  async validate(credentials: { email: string; password: string }): Promise<User | null> {
    const user = await this.findByEmail(credentials.email);
    if (!user) return null;

    const isValid = await bcrypt.compare(credentials.password, user.password);
    if (!isValid) return null;

    return user;
  }
}
