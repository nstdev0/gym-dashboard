import { NextFunction, Request, Response } from "express";
import { AuthService } from "../../../lib/api/auth.service";
import jwt from "jsonwebtoken";
import {config } from "dotenv"

config()

const secret: string = process.env.SECRET_KEY || "";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  signIn = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.signIn({ email, password });
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({
        message: error instanceof Error ? error.message : "Authentication failed",
      });
    }
  };

  register = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const result = await this.authService.register(data);
      res.status(201).json(result);
    } catch (error) {
       res.status(400).json({
        message: error instanceof Error ? error.message : "Registration failed",
      });
    }
  };

  signOut = async (req: Request, res: Response) => {
    try {
      const { userId } = req.body; // Or however you want to handle it, maybe just clear cookie? 
      // Current auth is JWT stateless, so client drops token. 
      // Server-side invalidation would need blacklist.
      // For now, just a dummy success.
      await this.authService.signOut(userId);
      res.status(200).json({ message: "Signed out successfully" });
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : "Sign out failed",
      });
    }
  };

  verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("REQUEST======>", req.headers);
      console.log("SECRET------>", secret);
      
      
      const token: string = req.headers.authorization?.split(" ")[1];
      console.log("TOKEN-------", token);
      const response = jwt.verify(token, secret);

      
      console.log("RESPONSE======>", response);
      
      return res.status(200).json(response)
    } catch (error) {
      res.status(401).json({
        message: error instanceof Error ? error.message : "Token verification failed",
      });
    }
  };
}
