import { Request, Response } from "express";
import { MembershipsService } from "../../../application/use-cases/memberships/membership.use-cases";
import { ApiResponse } from "../../../types/api";
import { Membership } from "../../../domain/entities/membership";
import { IPageableResult } from "../../../application/common/pagination";
import { ConnectionError } from "../../../domain/errors/connection-error";

export class MembershipsController {
  constructor(private membershipsService: MembershipsService) {}

  findAll = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const filters: Record<string, unknown> = req.query;

    try {
      const response = await this.membershipsService.findAll({
        page,
        pageSize,
        filters,
      });
      /* 
      // Removed check for empty records to likely return valid empty list
      if (response.records.length === 0) {
         ...
      }
      */
      const apiResponse: ApiResponse<IPageableResult<Membership>> = {
        isSuccess: true,
        data: response,
      };
      res.json(apiResponse);
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

  create = async (req: Request, res: Response) => {
    const data = req.body;
    try {
        const response = await this.membershipsService.create(data);
        const apiResponse: ApiResponse<Membership> = {
          isSuccess: true,
          data: response,
        };
        res.status(201).json(apiResponse);
    } catch (error) {
        const apiResponse: ApiResponse<null> = {
            isSuccess: false,
            error: {
              code: "CREATION_FAILED",
              description: error instanceof Error ? error.message : "Membership creation failed",
            },
        };
        res.status(500).json(apiResponse);
    }
  };

  findById = async (req: Request, res: Response) => {
    try {
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
      const response = await this.membershipsService.delete(id);
      const apiResponse: ApiResponse<Membership | null> = {
        isSuccess: true,
        data: response,
      };
      res.status(200).json(apiResponse);
    } catch (error) {
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
