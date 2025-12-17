import { Router } from "express";
import { PlanService } from "../../application/use-cases/plans/plan.use-cases";
import { PlanRepository } from "../../infrastructure/repositories/plans/plan.repository";
import { PlanController } from "../../interface-adapters/controllers/plans/plan.controller";

const planRepository = new PlanRepository();
const planService = new PlanService(planRepository);
const plansController = new PlanController(planService);

const router = Router();

router.get("/", plansController.findAll);

router.post("/", plansController.create);

router.get("/:id", plansController.findById);

router.put("/:id", plansController.update);

router.delete("/:id", plansController.delete);

export default router;
