import z from "zod";
import { MembershipStatusEnum } from "../../../../server/src/domain/enums/membership-status.enum";
import { DocTypeEnum } from "../../../../server/src/domain/enums/doctype.enum"; // Asegúrate de tener esto
import { GenderEnum } from "../../../../server/src/domain/enums/gender.enum"; // Y esto

// ---------------------------------------------------------
// 1. SCHEMAS "LITE" (Para romper Dependencias Circulares)
// ---------------------------------------------------------
// Definimos versiones ligeras de Member y Plan aquí mismo.

const memberLiteSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  docType: DocTypeEnum,
  docNumber: z.string(),
  email: z.string().nullable(),
  phoneNumber: z.string().nullable().optional(),
  isActive: z.boolean(),
  gender: GenderEnum.nullable().optional(),
});

const planLiteSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.coerce.number(), 
  durationInDays: z.number(),
});

// ---------------------------------------------------------
// 2. VALIDACIONES DE FECHA (Cross-field)
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
// 3. BASE SHAPE (Datos Planos)
// ---------------------------------------------------------
const membershipBaseShape = z.object({
  memberId: z.cuid2(),
  planId: z.cuid2(),

  // Coerce transforma el string "2025-12-27T..." a objeto Date real
  startDate: z.coerce.date("Inicio requerido"),
  endDate: z.coerce.date("Fin requerido"),

  status: MembershipStatusEnum.default("ACTIVE"),
  
  // Precio de la membresía específica (Snapshot)
  price: z.coerce.number().min(0),
});

// ---------------------------------------------------------
// 4. SCHEMAS FINALES
// ---------------------------------------------------------

/**
 * SCHEMA DE LECTURA (Lo que recibes de la API)
 * Incluye los objetos anidados 'member' y 'plan' usando los Lite Schemas
 */
export const membershipSchema = membershipBaseShape.extend({
  id: z.cuid2(),
  createdAt: z.coerce.date(), // Transforma el ISO string a Date
  updatedAt: z.coerce.date(),
  
  // ✅ AQUÍ USAMOS LOS LITE SCHEMAS
  member: memberLiteSchema.optional(), 
  plan: planLiteSchema.optional(),
});

export type Membership = z.infer<typeof membershipSchema>;

/**
 * SCHEMA DE CREACIÓN (Lo que envías al crear)
 */
export const membershipCreateSchema = membershipBaseShape
  .superRefine(validateDates);

export type MembershipCreateInput = z.infer<typeof membershipCreateSchema>;

/**
 * SCHEMA DE ACTUALIZACIÓN (Lo que envías al editar)
 */
export const membershipUpdateSchema = membershipBaseShape
  .partial()
  .superRefine(validateDates);

export type MembershipUpdateInput = z.infer<typeof membershipUpdateSchema>;