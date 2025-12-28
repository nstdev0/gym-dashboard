import { Router } from "express";
import { PlansController } from "../../interface-adapters/controllers/plans/plan.controller";
import { PlansService } from "../../application/use-cases/plans/plan.use-cases";
import { PlanRepository } from "../../infrastructure/repositories/plans/plan.repository";

const plansRepository = new PlanRepository();
const plansService = new PlansService(plansRepository);
const plansController = new PlansController(plansService);

const router = Router();

router.get("/", plansController.findAll);

router.post("/", plansController.create);

router.get("/:id", plansController.findById);

router.put("/:id", plansController.update);

router.delete("/:id", plansController.delete);

export default router;
