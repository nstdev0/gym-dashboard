import z from "zod";
import { GenderEnum, DocTypeEnum } from "../../../types/enums";
import { capitalizeText } from "../../../lib/utils";

// ---------------------------------------------------------
// REGLAS Y LÓGICA DE NEGOCIO
// ---------------------------------------------------------
const DOC_RULES = {
  DNI: { regex: /^\d{8}$/, msg: "El DNI debe tener 8 dígitos exactos" },
  CE: { regex: /^\d{9}$/, msg: "El CE debe tener 9 dígitos" },
  PASSPORT: { min: 6, max: 20, msg: "Pasaporte entre 6 y 20 caracteres" },
};

// Función de validación cross-field
const validateDocuments = (
  data: { docType?: DocTypeEnum | null; docNumber?: string | null },
  ctx: z.RefinementCtx
) => {
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
// BASE SHAPE
// ---------------------------------------------------------
const memberBaseShape = z.object({
  firstName: z
    .string()
    .min(1, "El nombre es requerido")
    .min(2, "Mínimo 2 caracteres")
    .transform(capitalizeText),

  lastName: z
    .string()
    .min(1, "El apellido es requerido")
    .min(2, "Mínimo 2 caracteres")
    .transform(capitalizeText),

  address: z.string().optional().nullable(),

  gender: GenderEnum.optional().nullable(),

  birthDate: z.coerce
    .date()
    .max(new Date(), "Fecha inválida (futuro)")
    .optional()
    .nullable(),

  height: z.coerce.number().positive("Debe ser positivo").optional().nullable(),

  weight: z.coerce.number().positive("Debe ser positivo").optional().nullable(),

  docType: DocTypeEnum,

  docNumber: z.string().min(1, "Documento requerido"),

  phoneNumber: z
    .string()
    .regex(/^9\d{8}$/, "Formato inválido (Ej: 912345678)")
    .optional()
    .nullable(),

  email: z.email("Email inválido").optional().nullable(),

  isActive: z.boolean().default(true),
});

// ---------------------------------------------------------
// SCHEMAS CONCRETOS
// ---------------------------------------------------------

/**
 * SCHEMA DE CREACIÓN
 */
export const memberCreateSchema =
  memberBaseShape.superRefine(validateDocuments);

export type MemberCreateInput = z.infer<typeof memberCreateSchema>;

/**
 * SCHEMA DE ACTUALIZACIÓN
 */
export const memberUpdateSchema = memberBaseShape
  .partial()
  .superRefine(validateDocuments);

export type MemberUpdateInput = z.infer<typeof memberUpdateSchema>;
