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
  implements IUsersRepository {
  constructor() {
    super(prisma.user);
  }

  async buildQueryFilters(
    filters: UsersFilters
  ): Promise<Record<string, unknown>> {
    const whereClause: Record<string, unknown> = {};

    if (filters.search) {
      const searchTerms = filters.search.trim().split(/\s+/).filter(Boolean);

      if (searchTerms.length > 0) {
        whereClause.AND = searchTerms.map((term) => ({
          OR: [
            { firstName: { contains: term } },
            { lastName: { contains: term } },
            { email: { contains: term } },
          ],
        }));
      }
    }

    return whereClause;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: { username },
    });
    return user;
  }

  async validate(credentials: {
    email: string;
    password: string;
  }): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email: credentials.email },
      });

      if (!user) {
        throw new Error("El usuario no existe");
      }

      const isPasswordValid = user.password && await bcrypt.compare(credentials.password, user.password);

      if (!isPasswordValid) {
        throw new Error("La contraseña es incorrecta");
      }

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    } catch (error) {
      console.error("Error validating user:", error);
      throw error;
    }
  }
}
