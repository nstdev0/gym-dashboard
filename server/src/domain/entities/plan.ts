import { Decimal } from "@prisma/client/runtime/client";

export type Plan = {
  id: string;

  name: string;
  description: string | null;

  price: Decimal;

  isActive: boolean;

  durationInDays: number;

  createdAt: Date;
  updatedAt: Date;
};
