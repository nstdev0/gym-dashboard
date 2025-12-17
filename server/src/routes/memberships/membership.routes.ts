import { Router } from "express";
import { MembershipsController } from "../../interface-adapters/controllers/memberships/membership.controller";
import { MembershipRepository } from "../../infrastructure/repositories/memberships/membership.repository";
import { MembershipService } from "../../application/use-cases/memberships/membership.use-cases";
import { PlanService } from "../../application/use-cases/plans/plan.use-cases";
import { PlanRepository } from "../../infrastructure/repositories/plans/plan.repository";
import { MemberRepository } from "../../infrastructure/repositories/members/member.repository";

const membershipsRepository = new MembershipRepository();
const membershipsService = new MembershipService(
  membershipsRepository,
  new MemberRepository(),
  new PlanRepository()
);
const membershipsController = new MembershipsController(membershipsService);

const router = Router();

router.post("/", membershipsController.create);

router.get("/", membershipsController.findAll);

router.get("/:id", membershipsController.findById);

router.put("/:id", membershipsController.update);

router.delete("/:id", membershipsController.delete);

export default router;
