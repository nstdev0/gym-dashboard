import { NextFunction, Request, Response } from "express";
import { PlansService } from "../../../application/use-cases/plans/plan.use-cases";
import { ApiResponse } from "../../../types/api";
import {
  Plan,
  planCreateSchema,
  planUpdateSchema,
} from "../../../domain/entities/plan";
import { IPageableResult } from "../../../application/common/pagination";
import asyncHandler from "express-async-handler";

export class PlansController {
  constructor(private plansService: PlansService) {}

  findAll = asyncHandler(async (req: Request, res: Response) => {
    const pageParam = req.query.page as string | undefined;
    const pageSizeParam = req.query.pageSize as string | undefined;
    const search = req.query.search as string | undefined;

    const page = pageParam ? parseInt(pageParam) : undefined;
    const pageSize = pageSizeParam ? parseInt(pageSizeParam) : undefined;

    const response = await this.plansService.findAll({
      page,
      pageSize,
      filters: { search },
    });
    const apiResponse: ApiResponse<IPageableResult<Plan>> = {
      isSuccess: true,
      data: response,
    };
    res.json(apiResponse);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const data = planCreateSchema.parse(req.body);
    const response = await this.plansService.create(data);
    const apiResponse: ApiResponse<Plan> = {
      isSuccess: true,
      data: response,
    };
    res.status(201).json(apiResponse);
  });

  findById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await this.plansService.findById(id);
    if (!response) {
      const apiResponse: ApiResponse<null> = {
        isSuccess: false,
        error: {
          code: "NOT_FOUND",
          description: "Plan not found",
        },
      };
      res.status(404).json(apiResponse);
      return;
    }
    const apiResponse: ApiResponse<Plan | null> = {
      isSuccess: true,
      data: response,
    };
    res.status(200).json(apiResponse);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = planUpdateSchema.parse(req.body);

    const response = await this.plansService.update(id, data);
    if (!response) {
      const apiResponse: ApiResponse<null> = {
        isSuccess: false,
        error: {
          code: "NOT_FOUND",
          description: "Plan not found",
        },
      };
      res.status(404).json(apiResponse);
      return;
    }
    const apiResponse: ApiResponse<Plan> = {
      isSuccess: true,
      data: response,
    };
    res.status(200).json(apiResponse);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await this.plansService.delete(id);
    const apiResponse: ApiResponse<Plan | null> = {
      isSuccess: true,
      data: response,
    };
    res.status(200).json(apiResponse);
  });
}
