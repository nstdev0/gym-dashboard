import { CreatePlanDTO, UpdatePlanDTO } from "../../../domain/DTOs/plan";
import { Plan } from "../../../domain/entities/plan";
import { PlanRepository } from "../../../infrastructure/repositories/plans/plan.repository";

export class PlanService {
  constructor(private planRepository: PlanRepository) {}

  findAll = async (): Promise<Plan[]> => {
    return await this.planRepository.findAll();
  };

  create = async (data: CreatePlanDTO): Promise<Plan> => {
    const existingPlanName = await this.planRepository.findByName(data.name);

    if (existingPlanName) {
      throw new Error(`Ya existe un plan con el nombre: ${data.name}`);
    }
    return await this.planRepository.create(data);
  };

  findById = async (id: string): Promise<Plan | null> => {
    return await this.planRepository.findById(id);
  };

  update = async (id: string, data: UpdatePlanDTO): Promise<Plan | null> => {
    return await this.planRepository.update(id, data);
  };

  delete = async (id: string): Promise<Plan | null> => {
    return await this.planRepository.delete(id);
  };
}
