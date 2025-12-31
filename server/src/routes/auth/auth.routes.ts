import { Router } from "express";
import { AuthController } from "../../interface-adapters/controllers/auth/auth.controller";
import { UserRepository } from "../../infrastructure/repositories/users/user.repository";
import { AuthService } from "@/lib/auth/auth.service";

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

const router = Router();

router.post("/sign-in", authController.signIn);
router.post("/sign-up", authController.register);
router.post("/sign-out", authController.signOut);
router.post("/verify-token", authController.verifyToken);

export default router;
