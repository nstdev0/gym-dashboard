import { Request, Response } from "express";

export class UserController {
  constructor(private readonly userService: any) {
    this.userService = userService;
  }

  findAll = async (req: Request, res: Response) => {
    const response = await this.userService.findAll();
    res.json(response);
  };

  create = async (req: Request, res: Response) => {
    const data = req.body;
    const response = await this.userService.create(data);
    res.json(response);
  };

  findById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await this.userService.findById(id);
    res.json(response);
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const response = await this.userService.update(id, data);
    res.json(response);
  };

  delete = async (req: Request, res: Response) => {
    const id = req.params.id;
    const response = await this.userService.delete(id);
    res.json(response);
  };
}
