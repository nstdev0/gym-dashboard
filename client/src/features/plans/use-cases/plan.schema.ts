import z from "zod";
import { capitalizeText } from "../../../lib/utils";

// ---------------------------------------------------------
// BASE SHAPE
// ---------------------------------------------------------
const planBaseShape = z.object({
  name: z
    .string()
    .min(1, "El nombre del plan es requerido")
    .min(3, "Mínimo 3 caracteres")
    .transform(capitalizeText),

  description: z.string().optional().nullable(),

  price: z.coerce.number().min(0, "El precio no puede ser negativo"),

  durationInDays: z.coerce
    .number()
    .int("Debe ser un número entero")
    .positive("La duración debe ser mayor a 0"),

  isActive: z.boolean().default(true),
});

// ---------------------------------------------------------
// SCHEMAS CONCRETOS
// ---------------------------------------------------------

export const planCreateSchema = planBaseShape;
export type PlanCreateInput = z.infer<typeof planCreateSchema>;

export const planUpdateSchema = planBaseShape.partial();
export type PlanUpdateInput = z.infer<typeof planUpdateSchema>;
