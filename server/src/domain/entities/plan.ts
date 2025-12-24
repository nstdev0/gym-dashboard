import z from "zod";
import { baseZ } from "./_base";

export const planSchema = z
  .object({
    name: z
      .string("El nombre del plan es inválido")
      .min(1, "El nombre del plan no puede estar vacío"),
    description: z
      .string("La descripción del plan es inválida")
      .optional()
      .nullable(),
    price: z
      .number("El precio del plan es inválido")
      .nonnegative("El precio del plan no puede ser negativo"),
    durationInDays: z
      .number("La duración del plan es inválida")
      .int("La duración del plan debe ser un número entero")
      .positive("La duración del plan debe ser un número positivo"),
    isActive: z.boolean("El estado del plan es inválido").default(true),
  })
  .extend(baseZ.shape);

export type Plan = z.infer<typeof planSchema>;

export const planInsertSchema = planSchema.pick({
  name: true,
  description: true,
  price: true,
  durationInDays: true,
  isActive: true,
});

export type PlanInsert = z.infer<typeof planInsertSchema>;

export const planUpdateSchema = planInsertSchema.partial();

export type PlanUpdate = z.infer<typeof planUpdateSchema>;
