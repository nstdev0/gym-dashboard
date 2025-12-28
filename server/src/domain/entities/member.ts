import z from "zod";
import { GenderEnum } from "../../../../server/src/domain/enums/gender.enum";
import { DocTypeEnum } from "../../../../server/src/domain/enums/doctype.enum";
import { capitalizeText } from "../../../../server/src/lib/utils/capitalize-text";
import { membershipSchema } from "./membership";
import { baseZ } from "./_base";

// ---------------------------------------------------------
// 1. REGLAS Y LÓGICA DE NEGOCIO (Reutilizables)
// ---------------------------------------------------------
const DOC_RULES = {
  DNI: { regex: /^\d{8}$/, msg: "El DNI debe tener 8 dígitos exactos" },
  CE: { regex: /^\d{9}$/, msg: "El CE debe tener 9 dígitos" },
  PASSPORT: { min: 6, max: 20, msg: "Pasaporte entre 6 y 20 caracteres" },
};

// Función de validación cross-field
const validateDocuments = (
  data: { docType?: string | null; docNumber?: string | null },
  ctx: z.RefinementCtx
) => {
  // Si falta alguno de los dos, no podemos validar la coherencia (útil para updates parciales)
  if (!data.docType || !data.docNumber) return;

  const { docType, docNumber } = data;

  if (docType === "DNI" && !DOC_RULES.DNI.regex.test(docNumber)) {
    ctx.addIssue({
      code: "custom",
      message: DOC_RULES.DNI.msg,
      path: ["docNumber"],
    });
  }
  if (docType === "CE" && !DOC_RULES.CE.regex.test(docNumber)) {
    ctx.addIssue({
      code: "custom",
      message: DOC_RULES.CE.msg,
      path: ["docNumber"],
    });
  }
  if (docType === "PASSPORT") {
    if (
      docNumber.length < DOC_RULES.PASSPORT.min ||
      docNumber.length > DOC_RULES.PASSPORT.max
    ) {
      ctx.addIssue({
        code: "custom",
        message: DOC_RULES.PASSPORT.msg,
        path: ["docNumber"],
      });
    }
  }
};

// ---------------------------------------------------------
// 2. BASE SHAPE (La estructura pura de tus datos)
// ---------------------------------------------------------
// Definimos esto SIN .superRefine para poder reutilizarlo con .pick() y .extend()
const memberBaseShape = z.object({
  firstName: z
    .string("El nombre es requerido")
    .min(2, "Mínimo 2 caracteres")
    .transform(capitalizeText),

  lastName: z
    .string("El apellido es requerido")
    .min(2, "Mínimo 2 caracteres")
    .transform(capitalizeText),

  gender: GenderEnum.optional().nullable(), // Prisma: Gender?

  // z.coerce es VITAL para formularios: convierte "2000-01-01" a Date
  birthDate: z.coerce
    .date()
    .max(new Date(), "Fecha inválida (futuro)")
    .optional()
    .nullable(),

  // coerce.number maneja el input type="number" que devuelve strings
  height: z.coerce.number().positive("Debe ser positivo").optional().nullable(),

  weight: z.coerce.number().positive("Debe ser positivo").optional().nullable(),

  docType: DocTypeEnum,

  docNumber: z.string("Documento requerido").min(1, "Requerido"),

  phoneNumber: z
    .string()
    .regex(/^9\d{8}$/, "Formato inválido (Ej: 912345678)")
    .optional()
    .nullable(),

  email: z.email("Email inválido").optional().nullable(), // Prisma: String? @unique

  isActive: z.boolean().default(true),
});

// ---------------------------------------------------------
// 3. SCHEMAS CONCRETOS
// ---------------------------------------------------------

/**
 * SCHEMA DE SALIDA (Database Model)
 * Úsalo cuando leas datos de la DB para tipar tu frontend
 */
export const memberSchema = memberBaseShape.extend(baseZ.shape).extend({
  memberships: z.array(membershipSchema).optional(),
});
export type Member = z.infer<typeof memberSchema>;

/**
 * SCHEMA DE CREACIÓN (Insert)
 * - id, createdAt, updatedAt NO van.
 * - Aplicamos la validación condicional DocType vs DocNumber
 */
export const memberCreateSchema =
  memberBaseShape.superRefine(validateDocuments); // 🔥 Validación lógica aquí

export type MemberCreateInput = z.infer<typeof memberCreateSchema>;

/**
 * SCHEMA DE ACTUALIZACIÓN (Update)
 * - Todo es opcional (Partial).
 * - id no va en el body (va en la URL).
 */
export const memberUpdateSchema = memberBaseShape
  .partial() // Hace todo opcional automáticamente
  .superRefine(validateDocuments); // 🔥 Re-valida si envías ambos campos

export type MemberUpdateInput = z.infer<typeof memberUpdateSchema>;
