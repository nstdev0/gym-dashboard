import { generateToken } from "./jwt";
import { UserRepository } from "../../infrastructure/repositories/users/user.repository";
import { UserCreateInput } from "../../domain/entities/user";

export class AuthService {
  constructor(private readonly userRepository: UserRepository) { }

  async generateToken(user: any) {
    if (!user) throw new Error("Cannot generate token for null user");
    const token = generateToken(user);
    return token;
  }

  async register(data: UserCreateInput) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    const existingUsername = data.username
      ? await this.userRepository.findByUsername(data.username)
      : null;
    if (existingUsername) {
      throw new Error("User already exists with this username");
    }

    const newUser = await this.userRepository.create(data);
    const token = await this.generateToken(newUser);
    return { token, role: newUser.role };
  }

  async signIn(credentials: { email: string; password: string }) {
    const validatedUser = await this.userRepository.validate(credentials);

    if (validatedUser) {
      const token = await this.generateToken(validatedUser);
      const user = await this.userRepository.findByEmail(credentials.email);
      return { token, role: user!.role };
    } else {
      throw new Error("Invalid email or password");
    }
  }
  async getMe(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  // async signOut(userId: string) {

  // }
}
