import z from "zod";
import { baseSchema, priceSchema } from "./base.schema";

export const planSchema = baseSchema.merge(
  z.object({
    name: z
      .string()
      .min(3, "El nombre del plan debe tener al menos 3 caracteres"),
    description: z
      .string()
      .max(500, "La descripción no puede exceder los 500 caracteres")
      .optional()
      .nullable(),
    price: priceSchema,
    isActive: z.boolean().default(true),
    durationInDays: z
      .number("La duración debe ser un número entero")
      .int("La duración debe ser un número entero")
      .min(30, "La duración mínima es de 30 días"),
  })
);

export const createPlanSchema = planSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePlanSchema = createPlanSchema.partial();

export type CreatePlanSchema = z.infer<typeof createPlanSchema>;
export type UpdatePlanSchema = z.infer<typeof updatePlanSchema>;
export type PlanSchema = z.infer<typeof planSchema>;
