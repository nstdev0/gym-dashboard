import { Router } from "express";
import { PlansController } from "../../interface-adapters/controllers/plans/plan.controller";
import { PlansService } from "../../application/use-cases/plans/plan.use-cases";
import { PlanRepository } from "../../infrastructure/repositories/plans/plan.repository";

const plansRepository = new PlanRepository();
const plansService = new PlansService(plansRepository);
const plansController = new PlansController(plansService);

import { verifyTokenMiddleware } from "@lib/auth/jwt";

const router = Router();

router.use(verifyTokenMiddleware);

router.get("/", plansController.findAll);

router.post("/", plansController.create);

router.get("/:id", plansController.findById);

router.put("/:id", plansController.update);

router.delete("/:id", plansController.delete);

export default router;
