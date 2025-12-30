import {
  Plan,
  PlanCreateInput,
  PlanUpdateInput,
} from "../../../domain/entities/plan";
import { IPageableResult } from "../../common/pagination";
import {
  IPlansRepository,
  PlansFilters,
} from "../../repositories/plans-repository.interface";
import { NotFoundError } from "../../../domain/errors/not-found-error";
import { AppError } from "../../../domain/errors/app-error";

export class PlansService {
  constructor(private plansRepository: IPlansRepository) {}

  findAll = async (request: {
    page?: number | undefined;
    pageSize?: number | undefined;
    filters?: PlansFilters;
  }): Promise<IPageableResult<Plan>> => {
    try {
      const response = await this.plansRepository.findAll(request);
      if (!response) {
        throw new NotFoundError("No plans found");
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  create = async (data: PlanCreateInput): Promise<Plan> => {
    const existingPlan = await this.plansRepository.findByName(data.name);

    if (existingPlan) {
      throw new AppError(`Ya existe un plan con el nombre: ${data.name}`, 409);
    }

    return await this.plansRepository.create(data);
  };

  findById = async (id: string): Promise<Plan | null> => {
    return await this.plansRepository.findById(id);
  };

  update = async (id: string, data: PlanUpdateInput): Promise<Plan | null> => {
    if (data.name) {
      const existingPlan = await this.plansRepository.findByName(data.name);
      if (existingPlan && existingPlan.id !== id) {
        throw new AppError(
          `Ya existe un plan con el nombre: ${data.name}`,
          409,
          "PLAN_ALREADY_EXISTS"
        );
      }
    }
    return await this.plansRepository.update(id, data);
  };

  delete = async (id: string): Promise<Plan | null> => {
    return await this.plansRepository.delete(id);
  };
}
