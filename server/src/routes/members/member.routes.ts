import { Router } from "express";
import { MembersController } from "../../interface-adapters/controllers/members/members.controller";
import { MembersService } from "../../application/use-cases/members/member.use-cases";
import { MemberRepository } from "../../infrastructure/repositories/members/member.repository";

const membersRepository = new MemberRepository();
const membersService = new MembersService(membersRepository);
const membersController = new MembersController(membersService);

const router = Router();

router.get("/", membersController.findAll);

router.post("/", membersController.create);

// TODO: Implementar las siguientes rutas:

router.get("/:id", membersController.findById);

router.put("/:id", membersController.update);

router.delete("/:id", membersController.delete);

export default router;
