import { Router } from "express";
import { getMembersController } from "../../interface-adapters/controllers/members/get-members.controller";

const router = Router();

router.get("/", getMembersController);

export default router;