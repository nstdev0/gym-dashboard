export type Plan = {
  id: string;

  name: string;
  description: string | null;

  price: number;

  isActive: boolean;

  durationInDays: number;

  createdAt: Date;
  updatedAt: Date;
};
