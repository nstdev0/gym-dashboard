import { NextFunction, Request, Response } from "express";
import { AuthService } from "@lib/auth/auth.service";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { userCreateSchema } from "../../../domain/entities/user";
import z from "zod";
import asyncHandler from "express-async-handler";

config();

const secret: string = process.env.SECRET_KEY || "";

const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(1, "Contraseña requerida"),
});

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  signIn = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = loginSchema.parse(req.body);
      const result = await this.authService.signIn({ email, password });
      res.status(200).json(result);
    }
  );

  register = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = userCreateSchema.parse(req.body);
      const result = await this.authService.register(data);
      res.status(201).json(result);
    }
  );

  signOut = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { userId } = req.body;
      await this.authService.signOut(userId);
      res.status(200).json({ message: "Signed out successfully" });
    }
  );

  verifyToken = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const token = req.headers.authorization?.split(" ")[1] || "";
      const response = jwt.verify(token, secret);
      res.status(200).json(response);
    }
  );
}
