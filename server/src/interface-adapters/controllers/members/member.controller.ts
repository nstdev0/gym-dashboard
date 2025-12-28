import { Request, Response } from "express";
import { MembersService } from "../../../application/use-cases/members/member.use-cases";
import { ApiResponse } from "../../../types/api";
import { Member } from "../../../domain/entities/member";
import { IPageableResult } from "../../../application/common/pagination";
import { ConnectionError } from "../../../domain/errors/connection-error";

export class MembersController {
  constructor(private membersService: MembersService) {}

  findAll = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const filters: Record<string, unknown> = req.query;

    try {
      const response = await this.membersService.findAll({
        page,
        pageSize,
        filters,
      });
      /*
      if (response.records.length === 0) {
          ...
      }
      */
      const apiResponse: ApiResponse<IPageableResult<Member>> = {
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
      }
    }
  };

  create = async (req: Request, res: Response) => {
    const data = req.body;
    const response = await this.membersService.create(data);
    if (!response) {
      const apiResponse: ApiResponse<null> = {
        isSuccess: false,
        error: {
          code: "CREATION_FAILED",
          description: "Member creation failed",
        },
      };
      res.status(500).json(apiResponse);
    }
    const apiResponse: ApiResponse<Member> = {
      isSuccess: true,
      data: response,
    };
    res.status(201).json(apiResponse);
  };

  findById = async (req: Request, res: Response) => {
    try {
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
      }
      const apiResponse: ApiResponse<Member | null> = {
        isSuccess: true,
        data: response,
      };
      res.status(200).json(apiResponse);
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
      }
    }
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    try {
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
      }
      const apiResponse: ApiResponse<Member> = {
        isSuccess: true,
        data: response,
      };
      res.status(200).json(apiResponse);
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
      }
    }
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const response = await this.membersService.delete(id);
      const apiResponse: ApiResponse<Member> = {
        isSuccess: true,
        data: response,
      };
      res.status(200).json(apiResponse);
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
      }
    }
  };
}
