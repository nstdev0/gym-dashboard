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

export class PlansService {
  constructor(private plansRepository: IPlansRepository) {}

  findAll = async (request: {
    page: number;
    pageSize: number;
    filters?: PlansFilters;
  }): Promise<IPageableResult<Plan>> => {
    try {
      const response = await this.plansRepository.findAll(request);
      if (!response) {
        throw new Error("No plans found");
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  create = async (data: PlanCreateInput): Promise<Plan> => {
    const existingPlan = await this.plansRepository.findByName(data.name);

    if (existingPlan) {
      throw new Error(`Ya existe un plan con el nombre: ${data.name}`);
    }

    return await this.plansRepository.create(data);
  };

  findById = async (id: string): Promise<Plan | null> => {
    return await this.plansRepository.findById(id);
  };

  update = async (id: string, data: PlanUpdateInput): Promise<Plan | null> => {
    // Optional: Check name uniqueness if name is being updated
    if (data.name) {
        const existingPlan = await this.plansRepository.findByName(data.name);
        if (existingPlan && existingPlan.id !== id) {
             throw new Error(`Ya existe un plan con el nombre: ${data.name}`);
        }
    }
    return await this.plansRepository.update(id, data);
  };

  delete = async (id: string): Promise<Plan | null> => {
    return await this.plansRepository.delete(id);
  };
}
