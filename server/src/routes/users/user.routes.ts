import { Router } from "express";
import { UsersController } from "../../interface-adapters/controllers/users/user.controller";
import { UsersService } from "../../application/use-cases/users/user.use-cases";
import { UserRepository } from "../../infrastructure/repositories/users/user.repository";

const userRepository = new UserRepository();
const usersService = new UsersService(userRepository);
const usersController = new UsersController(usersService);

import { verifyTokenMiddleware } from "@lib/auth/jwt";

const router = Router();

router.use(verifyTokenMiddleware);

router.get("/", usersController.findAll);

router.post("/", usersController.create);

router.get("/:id", usersController.findById);

router.put("/:id", usersController.update);

router.delete("/:id", usersController.delete);

export default router;
