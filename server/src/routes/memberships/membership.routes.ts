import { Router } from "express";
import { MembershipsController } from "../../interface-adapters/controllers/memberships/membership.controller";
import { MembershipsService } from "../../application/use-cases/memberships/membership.use-cases";
import { MembershipRepository } from "../../infrastructure/repositories/memberships/membership.repository";

const membershipsRepository = new MembershipRepository();
const membershipsService = new MembershipsService(membershipsRepository);
const membershipsController = new MembershipsController(membershipsService);

const router = Router();

router.get("/", membershipsController.findAll);

router.post("/", membershipsController.create);

router.get("/:id", membershipsController.findById);

router.put("/:id", membershipsController.update);

router.delete("/:id", membershipsController.delete);

export default router;
