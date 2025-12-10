import { Router } from "express";
import { MembersController } from "../../interface-adapters/controllers/members/members.controller";
import { MembersService } from "../../features/services/members/members.service";
import { MembersRepository } from "../../infraestructure/repositories/members/members.repository";

const membersRepository = new MembersRepository();
const membersService = new MembersService(membersRepository);
const membersController = new MembersController(membersService)

const router = Router()

router.get("/", membersController.allMembers)
router.get("/:id", membersController.memberById)

export default router