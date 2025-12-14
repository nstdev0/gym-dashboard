import { Router } from "express";
import { UserService } from "../../application/use-cases/users/user.use-cases";
import { UserRepository } from "../../infrastructure/repositories/users/user.repository";
import { UserController } from "../../interface-adapters/controllers/users/user.controller";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const router = Router();

router.get("/", userController.findAll);

router.post("/", userController.create);

router.get("/:id", userController.findById);

router.put("/:id", userController.update);

router.delete("/:id", userController.delete);

export default router;
