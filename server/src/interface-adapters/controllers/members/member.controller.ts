import { Request, Response } from "express";
import { MembersService } from "../../../application/use-cases/members/member.use-cases";

export class MembersController {
  constructor(private membersService: MembersService) {}

  findAll = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const response = await this.membersService.findAll({ page, pageSize, filters: {} });
    res.json(response);
  };

  create = async (req: Request, res: Response) => {
    const data = req.body;
    const response = await this.membersService.create(data);
    res.json(response);
  };

  findById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await this.membersService.findById(id);
    res.json(response);
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const response = await this.membersService.update(id, data);
    res.json(response);
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await this.membersService.delete(id);
    res.json(response);
  };
}
