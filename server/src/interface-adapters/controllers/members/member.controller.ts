import { NextFunction, Request, Response } from "express";
import { MembersService } from "@use-cases/members/member.use-cases";
import { ApiResponse } from "@/types/api";
import {
  Member,
  memberCreateSchema,
  memberUpdateSchema,
} from "@entities/member";
import { IPageableResult } from "@common/pagination";
import asyncHandler from "express-async-handler";

export class MembersController {
  constructor(private membersService: MembersService) {}

  findAll = asyncHandler(async (req: Request, res: Response) => {
    const pageParam = req.query.page as string | undefined;
    const pageSizeParam = req.query.pageSize as string | undefined;
    const search = req.query.search as string | undefined;

    const page = pageParam ? parseInt(pageParam) : undefined;
    const pageSize = pageSizeParam ? parseInt(pageSizeParam) : undefined;

    const response = await this.membersService.findAll({
      page,
      pageSize,
      filters: { search },
    });
    const apiResponse: ApiResponse<IPageableResult<Member>> = {
      isSuccess: true,
      data: response,
    };
    res.json(apiResponse);
  });

  create = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = memberCreateSchema.parse(req.body);
      const response = await this.membersService.create(data);
      if (!response) {
        throw new Error("Member creation failed");
      }
      const apiResponse: ApiResponse<Member> = {
        isSuccess: true,
        data: response,
      };
      res.status(201).json(apiResponse);
    }
  );

  findById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await this.membersService.findById(id);
    if (!response) {
      const apiResponse: ApiResponse<null> = {
        isSuccess: false,
        error: {
          code: "NOT_FOUND",
          description: "Member not found",
        },
      };
      res.status(404).json(apiResponse);
      return;
    }
    const apiResponse: ApiResponse<Member | null> = {
      isSuccess: true,
      data: response,
    };
    res.status(200).json(apiResponse);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = memberUpdateSchema.parse(req.body);

    const response = await this.membersService.update(id, data);
    if (!response) {
      const apiResponse: ApiResponse<null> = {
        isSuccess: false,
        error: {
          code: "NOT_FOUND",
          description: "Member not found",
        },
      };
      res.status(404).json(apiResponse);
      return;
    }
    const apiResponse: ApiResponse<Member> = {
      isSuccess: true,
      data: response,
    };
    res.status(200).json(apiResponse);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await this.membersService.delete(id);
    const apiResponse: ApiResponse<Member | null> = {
      isSuccess: true,
      data: response,
    };
    res.status(200).json(apiResponse);
  });
}
