import { Request, Response } from "express";
import { MembersService } from "../../../features/services/members/members.service";

export class MembersController {
    constructor(private membersService: MembersService) {}

    allMembers = async (req: Request, res: Response) => {
        const members = await this.membersService.allMembers()
        res.json(members)
    }

    memberById = async (req: Request, res: Response) => {
        const member = await this.membersService.memberById(Number(req.params.id))
        res.json(member)
    }
}