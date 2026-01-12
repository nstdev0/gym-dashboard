import z from "zod";
import { MembershipStatusEnum } from "../../../types/enums";

// ---------------------------------------------------------
// VALIDACIONES DE FECHA (Cross-field)
// ---------------------------------------------------------
const validateDates = (
  data: { startDate?: Date | null; endDate?: Date | null },
  ctx: z.RefinementCtx
) => {
  if (data.startDate && data.endDate) {
    if (data.endDate < data.startDate) {
      ctx.addIssue({
        code: "custom",
        message: "La fecha de fin no puede ser anterior a la de inicio",
        path: ["endDate"],
      });
    }
  }
};

// ---------------------------------------------------------
// BASE SHAPE
// ---------------------------------------------------------
const membershipBaseShape = z.object({
  memberId: z.string().min(1, "Miembro requerido"), // cuid2 validation on frontend might be overkill, just string min 1
  planId: z.string().min(1, "Plan requerido"),

  startDate: z.coerce.date(),
  endDate: z.coerce.date(),

  status: MembershipStatusEnum.default("ACTIVE"),

  price: z.coerce.number().min(0, "El precio no puede ser negativo"),
});

// ---------------------------------------------------------
// SCHEMAS CONCRETOS
// ---------------------------------------------------------

/**
 * SCHEMA DE CREACIÓN
 */
export const membershipCreateSchema =
  membershipBaseShape.superRefine(validateDates);

export type MembershipCreateInput = z.infer<typeof membershipCreateSchema>;

/**
 * SCHEMA DE ACTUALIZACIÓN
 */
export const membershipUpdateSchema = membershipBaseShape
  .partial()
  .superRefine(validateDates);

export type MembershipUpdateInput = z.infer<typeof membershipUpdateSchema>;
