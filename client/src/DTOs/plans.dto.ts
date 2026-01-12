export interface Plan {
  id: string;
  name: string;
  description?: string | null;
  price: number | string; // Backend said string or number for Decimal
  durationInDays: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePlanDto {
  name: string;
  description?: string | null;
  price: number;
  durationInDays: number;
  isActive?: boolean;
}

export type UpdatePlanDto = Partial<CreatePlanDto>;
