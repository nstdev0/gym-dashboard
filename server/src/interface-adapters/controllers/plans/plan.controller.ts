import { Request, Response } from "express";
import { PlanService } from "../../../application/use-cases/plans/plan.use-cases";

export class PlanController {
  constructor(private planService: PlanService) {}

  findAll = async (req: Request, res: Response) => {
    const response = await this.planService.findAll();
    res.json(response);
  };

  create = async (req: Request, res: Response) => {
    const data = req.body;
    const response = await this.planService.create(data);
    res.json(response);
  };

  findById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await this.planService.findById(id);
    res.json(response);
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const response = await this.planService.update(id, data);
    res.json(response);
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await this.planService.delete(id);
    res.json(response);
  };
}
