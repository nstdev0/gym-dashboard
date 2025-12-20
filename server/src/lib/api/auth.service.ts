import { generateToken, verifyTokenMiddleware } from "./jwt";
import { CreateUserDTO } from "../../domain/DTOs/user";
import { UserRepository } from "../../infrastructure/repositories/users/user.repository";

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async generateToken(user: any) {
    if (!user) throw new Error("Cannot generate token for null user");
    const token = generateToken(user);
    return token;
  }

  async register(data: CreateUserDTO) {
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
      const user= await this.userRepository.findByEmail(credentials.email)
      return {token, role: user!.role};
    } else {
      throw new Error("Invalid email or password");
    }
  }

  async signOut(userId: string) {
    // Implement sign-out logic if needed (e.g., invalidate token)
  }
}
