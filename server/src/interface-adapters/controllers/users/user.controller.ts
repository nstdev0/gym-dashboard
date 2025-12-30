import { NextFunction, Request, Response } from "express";
import { UsersService } from "../../../application/use-cases/users/user.use-cases";
import { ApiResponse } from "../../../types/api";
import {
  User,
  userCreateSchema,
  userUpdateSchema,
} from "../../../domain/entities/user";
import { IPageableResult } from "../../../application/common/pagination";
import asyncHandler from "express-async-handler";

export class UsersController {
  constructor(private usersService: UsersService) {}

  findAll = asyncHandler(async (req: Request, res: Response) => {
    const pageParam = req.query.page as string | undefined;
    const pageSizeParam = req.query.pageSize as string | undefined;
    const search = req.query.search as string | undefined;

    const page = pageParam ? parseInt(pageParam) : undefined;
    const pageSize = pageSizeParam ? parseInt(pageSizeParam) : undefined;

    const response = await this.usersService.findAll({
      page,
      pageSize,
      filters: { search },
    });
    const apiResponse: ApiResponse<IPageableResult<User>> = {
      isSuccess: true,
      data: response,
    };
    res.json(apiResponse);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const data = userCreateSchema.parse(req.body);
    const response = await this.usersService.create(data);
    const apiResponse: ApiResponse<User> = {
      isSuccess: true,
      data: response,
    };
    res.status(201).json(apiResponse);
  });

  findById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await this.usersService.findById(id);
    if (!response) {
      const apiResponse: ApiResponse<null> = {
        isSuccess: false,
        error: {
          code: "NOT_FOUND",
          description: "User not found",
        },
      };
      res.status(404).json(apiResponse);
      return;
    }
    const apiResponse: ApiResponse<User | null> = {
      isSuccess: true,
      data: response,
    };
    res.status(200).json(apiResponse);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = userUpdateSchema.parse(req.body);

    const response = await this.usersService.update(id, data);
    if (!response) {
      const apiResponse: ApiResponse<null> = {
        isSuccess: false,
        error: {
          code: "NOT_FOUND",
          description: "User not found",
        },
      };
      res.status(404).json(apiResponse);
      return;
    }
    const apiResponse: ApiResponse<User> = {
      isSuccess: true,
      data: response,
    };
    res.status(200).json(apiResponse);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await this.usersService.delete(id);
    const apiResponse: ApiResponse<User | null> = {
      isSuccess: true,
      data: response,
    };
    res.status(200).json(apiResponse);
  });
}
