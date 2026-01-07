import {
  IUsersRepository,
  UsersFilters,
} from "../../../application/repositories/users-repository.interface";
import { User } from "../../../domain/entities/user";
import { prisma } from "../../../lib/prisma";
import { BaseRepository } from "../base.repository";
import bcrypt from "bcrypt";

export class UserRepository
  extends BaseRepository<User, UsersFilters>
  implements IUsersRepository
{
  constructor() {
    super(prisma.user);
  }

  async buildQueryFilters(
    filters: UsersFilters
  ): Promise<Record<string, unknown>> {
    const whereClause: Record<string, unknown> = {};

    if (filters.search) {
      whereClause.OR = [
        { firstName: { contains: filters.search } },
        { lastName: { contains: filters.search } },
        { email: { contains: filters.search } },
      ];
    }

    if (filters.role) {
      whereClause.role = filters.role;
    }

    return whereClause;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user as User;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: { username },
    });
    return user as User;
  }

  async validate(credentials: { email: string; password: string }): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (user && user.password && (await bcrypt.compare(credentials.password, user.password))) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    }

    return null;
  }
}
