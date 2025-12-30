import { Plan } from "../../domain/entities/plan";
import { IBaseRepository } from "./base-repository.interface";

export type PlansFilters = {
  search?: string | null;
  isActive?: boolean | null;
};

export interface IPlansRepository extends IBaseRepository<Plan, PlansFilters> {
  // Add specific methods if needed, e.g., findByName
  findByName(name: string): Promise<Plan | null>;
}
