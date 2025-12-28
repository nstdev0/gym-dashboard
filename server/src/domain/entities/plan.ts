import z from "zod";
import { capitalizeText } from "../../../../server/src/lib/utils/capitalize-text";

// ---------------------------------------------------------
// BASE SHAPE
// ---------------------------------------------------------
const planBaseShape = z.object({
  name: z
    .string("El nombre del plan es requerido")
    .min(3, "Mínimo 3 caracteres")
    .transform(capitalizeText),

  description: z.string().optional().nullable(),

  // Coerce number permite recibir "99.90" del input y validarlo como número
  price: z.coerce
    .number("El precio es requerido")
    .min(0, "El precio no puede ser negativo"),

  durationInDays: z.coerce
    .number("Duración requerida")
    .int("Debe ser un número entero")
    .positive("La duración debe ser mayor a 0"),

  isActive: z.boolean().default(true),
});

// ---------------------------------------------------------
// SCHEMAS CONCRETOS
// ---------------------------------------------------------

export const planSchema = planBaseShape.extend({
  id: z.string().cuid(),
  // Override de price para salida: Prisma Decimal suele serializarse a string en APIs
  price: z.number().or(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Plan = z.infer<typeof planSchema>;

export const planCreateSchema = planBaseShape;
export type PlanCreateInput = z.infer<typeof planCreateSchema>;

export const planUpdateSchema = planBaseShape.partial();
export type PlanUpdateInput = z.infer<typeof planUpdateSchema>;
