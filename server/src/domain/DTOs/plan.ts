import { Plan } from "../entities/plan";

export type CreatePlanDTO = Partial<Plan> & {
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  durationInDays: number;
};

export type UpdatePlanDTO = Partial<CreatePlanDTO>;
