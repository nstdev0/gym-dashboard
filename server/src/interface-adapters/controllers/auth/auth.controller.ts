import { NextFunction, Request, Response } from "express";
import { AuthService } from "@lib/auth/auth.service";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import asyncHandler from "express-async-handler";
import { loginSchema, userCreateSchema } from "../../../domain/entities/user";
import { ApiResponse } from "@/types/api";

config();

const secret: string = process.env.SECRET_KEY || "";

export class AuthController {
  constructor(private readonly authService: AuthService) { }

  register = asyncHandler(async (req: Request, res: Response) => {
    const parsedData = userCreateSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json(parsedData.error);
      return;
    }
    const result = await this.authService.register(parsedData.data);

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const apiResponse: ApiResponse<{ token: string; role: string }> = {
      isSuccess: true,
      data: result,
    };
    res.status(201).json(apiResponse);
  });

  signIn = asyncHandler(async (req: Request, res: Response) => {

    const parsedData = loginSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json(parsedData.error);
      return;
    }
    const { email, password } = parsedData.data;

    try {
      const result = await this.authService.signIn({ email, password });

      res.cookie("token", result.token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      const apiResponse: ApiResponse<{ token: string; role: string }> = {
        isSuccess: true,
        data: {
          token: result.token,
          role: result.role,
        },
      };
      res.status(200).json(apiResponse);
    } catch (error: any) {
      if (error.message === "Invalid email or password") {
        res.status(401).json({
          isSuccess: false,
          error: {
            code: "INVALID_CREDENTIALS",
            description: "Invalid email or password",
          },
        });
      } else {
        res.status(500).json({
          isSuccess: false,
          error: {
            code: "INTERNAL_SERVER_ERROR",
            description: error.message || "Internal server error",
          },
        });
      }
    }
  });

  signOut = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    const apiResponse: ApiResponse<{ message: string }> = {
      isSuccess: true,
      data: { message: "Signed out successfully" },
    };
    res.status(200).json(apiResponse);
  });

  me = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
      res.status(401).json({ isSuccess: false, message: "Unauthorized" });
      return;
    }

    const user = await this.authService.getMe(req.user.id);
    const apiResponse: ApiResponse<any> = {
      isSuccess: true,
      data: user,
    };
    res.status(200).json(apiResponse);
  });

  verifyToken = asyncHandler(async (req: Request, res: Response) => {
    const token =
      req.cookies.token || req.headers.authorization?.split(" ")[1] || "";
    const response = jwt.verify(token, secret);
    const apiResponse: ApiResponse<any> = {
      isSuccess: true,
      data: response,
    };
    res.status(200).json(apiResponse);
  });
}
