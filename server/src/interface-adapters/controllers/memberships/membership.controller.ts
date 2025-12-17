import { Request, Response } from "express";
import { MembershipService } from "../../../application/use-cases/memberships/membership.use-cases";

export class MembershipsController {
  constructor(private membershipsService: MembershipService) {}

  findAll = async (req: Request, res: Response) => {
    const response = await this.membershipsService.findAll();
    res.json(response);
  };

  findById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await this.membershipsService.findById(id);
    res.json(response);
  };

  create = async (req: Request, res: Response) => {
    const data = req.body;
    const response = await this.membershipsService.create(data);
    res.json(response);
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const response = await this.membershipsService.update(id, data);
    res.json(response);
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await this.membershipsService.delete(id);
    res.json(response);
  };
}
