import { Request, Response } from "express";
import { PlansService } from "../../../application/use-cases/plans/plan.use-cases";
import { ApiResponse } from "../../../types/api";
import { Plan } from "../../../domain/entities/plan";
import { IPageableResult } from "../../../application/common/pagination";
import { ConnectionError } from "../../../domain/errors/connection-error";

export class PlansController {
  constructor(private plansService: PlansService) {}

  findAll = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const filters: Record<string, unknown> = req.query;

    try {
      const response = await this.plansService.findAll({
        page,
        pageSize,
        filters,
      });
      const apiResponse: ApiResponse<IPageableResult<Plan>> = {
        isSuccess: true,
        data: response,
      };
      res.json(apiResponse);
    } catch (error) {
      if (error instanceof ConnectionError) {
        const apiResponse: ApiResponse<null> = {
          isSuccess: false,
          error: {
            code: error.code,
            description: error.message,
          },
        };
        res.status(500).json(apiResponse);
      } else {
         const apiResponse: ApiResponse<null> = {
          isSuccess: false,
          error: {
            code: "INTERNAL_ERROR",
            description: error instanceof Error ? error.message : "Unknown error",
          },
        };
        res.status(500).json(apiResponse);
      }
    }
  };

  create = async (req: Request, res: Response) => {
    const data = req.body;
    try {
        const response = await this.plansService.create(data);
        const apiResponse: ApiResponse<Plan> = {
          isSuccess: true,
          data: response,
        };
        res.status(201).json(apiResponse);
    } catch (error) {
        const apiResponse: ApiResponse<null> = {
            isSuccess: false,
            error: {
              code: "CREATION_FAILED",
              description: error instanceof Error ? error.message : "Plan creation failed",
            },
        };
        res.status(500).json(apiResponse);
    }
  };

  findById = async (req: Request, res: Response) => {
    try {
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
    } catch (error) {
       const apiResponse: ApiResponse<null> = {
          isSuccess: false,
          error: {
            code: "INTERNAL_ERROR",
            description: error instanceof Error ? error.message : "Unknown error",
          },
        };
        res.status(500).json(apiResponse);
    }
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    try {
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
    } catch (error) {
       const apiResponse: ApiResponse<null> = {
          isSuccess: false,
          error: {
            code: "UPDATE_FAILED",
            description: error instanceof Error ? error.message : "Update failed",
          },
        };
        res.status(500).json(apiResponse);
    }
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const response = await this.plansService.delete(id);
      const apiResponse: ApiResponse<Plan | null> = {
        isSuccess: true,
        data: response,
      };
      res.status(200).json(apiResponse);
    } catch (error) {
        // Handle deletion constraint errors (e.g. if plan has active memberships)
       const apiResponse: ApiResponse<null> = {
          isSuccess: false,
          error: {
            code: "DELETE_FAILED",
            description: error instanceof Error ? error.message : "Delete failed",
          },
        };
        res.status(500).json(apiResponse);
    }
  };
}
