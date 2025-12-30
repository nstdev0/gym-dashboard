import { NextFunction, Request, Response } from "express";
import { MembershipsService } from "../../../application/use-cases/memberships/membership.use-cases";
import { ApiResponse } from "../../../types/api";
import {
  Membership,
  membershipCreateSchema,
  membershipUpdateSchema,
} from "../../../domain/entities/membership";
import { IPageableResult } from "../../../application/common/pagination";
import asyncHandler from "express-async-handler";

export class MembershipsController {
  constructor(private membershipsService: MembershipsService) {}

  findAll = asyncHandler(async (req: Request, res: Response) => {
    const pageParam = req.query.page as string | undefined;
    const pageSizeParam = req.query.pageSize as string | undefined;
    const search = req.query.search as string | undefined;

    const page = pageParam ? parseInt(pageParam) : undefined;
    const pageSize = pageSizeParam ? parseInt(pageSizeParam) : undefined;

    const response = await this.membershipsService.findAll({
      page,
      pageSize,
      filters: { search },
    });
    const apiResponse: ApiResponse<IPageableResult<Membership>> = {
      isSuccess: true,
      data: response,
    };
    res.json(apiResponse);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const data = membershipCreateSchema.parse(req.body);
    const response = await this.membershipsService.create(data);
    const apiResponse: ApiResponse<Membership> = {
      isSuccess: true,
      data: response,
    };
    res.status(201).json(apiResponse);
  });

  findById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await this.membershipsService.findById(id);
    if (!response) {
      const apiResponse: ApiResponse<null> = {
        isSuccess: false,
        error: {
          code: "NOT_FOUND",
          description: "Membership not found",
        },
      };
      res.status(404).json(apiResponse);
      return;
    }
    const apiResponse: ApiResponse<Membership | null> = {
      isSuccess: true,
      data: response,
    };
    res.status(200).json(apiResponse);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = membershipUpdateSchema.parse(req.body);

    const response = await this.membershipsService.update(id, data);
    if (!response) {
      const apiResponse: ApiResponse<null> = {
        isSuccess: false,
        error: {
          code: "NOT_FOUND",
          description: "Membership not found",
        },
      };
      res.status(404).json(apiResponse);
      return;
    }
    const apiResponse: ApiResponse<Membership> = {
      isSuccess: true,
      data: response,
    };
    res.status(200).json(apiResponse);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await this.membershipsService.delete(id);
    const apiResponse: ApiResponse<Membership | null> = {
      isSuccess: true,
      data: response,
    };
    res.status(200).json(apiResponse);
  });
}
