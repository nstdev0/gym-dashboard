import { Request, Response } from "express";
import { MembersService } from "../../../application/use-cases/members/member.use-cases";

export class MembersController {
  constructor(private membersService: MembersService) {}

  findAll = async (req: Request, res: Response) => {
    const response = await this.membersService.findAll();
    res.json(response);
  };

  create = async (req: Request, res: Response) => {
    const data = req.body;
    console.log("MEMBER DATA TO CREATE =====>", req);

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
    const id = req.params.id;
    const response = await this.membersService.delete(id);
    res.json(response);
  };

  // memberById = async (req: Request, res: Response) => {
  //   const member = await this.membersService.memberById(Number(req.params.id));
  //   res.json(member);
  // };
}
