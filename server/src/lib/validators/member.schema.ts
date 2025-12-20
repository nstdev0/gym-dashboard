import { z } from "zod";
import {
  baseSchema,
  dateSchema,
  docTypeSchema,
  genderSchema,
  phoneSchema,
} from "./base.schema";

const memberShape = baseSchema.merge(
  z.object({
    firstName: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .regex(/^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]+$/, "El nombre debe contener solo letras"),
    lastName: z
      .string()
      .min(3, "El apellido debe tener al menos 3 caracteres")
      .regex(/^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]+$/, "El apellido debe contener solo letras")
      .optional()
      .nullable(),
    gender: genderSchema,
    birthDate: dateSchema.optional().nullable(),
    height: z
      .number()
      .min(0, "La altura no puede ser negativa")
      .optional()
      .nullable(),
    weight: z
      .number()
      .min(0, "El peso no puede ser negativo")
      .optional()
      .nullable(),
    docType: docTypeSchema,
    docNumber: z
      .string()
      .min(1, "El número de documento es obligatorio")
      .regex(/^[0-9]+$/, "El número de documento debe contener solo números"),
    phoneNumber: phoneSchema.optional().nullable(),
    isActive: z.boolean().default(true),
  })
);

const memberRefinement = (data: any, ctx: z.RefinementCtx) => {
  if (data.birthDate && new Date(data.birthDate) > new Date()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "La fecha de nacimiento no puede ser futura",
      path: ["birthDate"],
    });
  }
  if (data.height && data.height < 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "La altura no puede ser negativa",
      path: ["height"],
    });
  }
  if (data.weight && data.weight < 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "El peso no puede ser negativo",
      path: ["weight"],
    });
  }

  if (data.docType === "DNI" && data.docNumber?.length !== 8) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "El DNI debe tener 8 caracteres",
      path: ["docNumber"],
    });
  }
  if (data.docType === "PASSPORT" && data.docNumber?.length !== 9) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "El pasaporte debe tener 9 caracteres",
      path: ["docNumber"],
    });
  }
  if (data.docType === "CE" && data.docNumber?.length !== 11) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "La cédula de extranjería debe tener 11 caracteres",
      path: ["docNumber"],
    });
  }
};

export const createMemberSchema = memberShape
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .superRefine(memberRefinement)

export const updateMemberSchema = memberShape
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial()
  .superRefine(memberRefinement);

export const memberSchema = memberShape;

export type CreateMemberSchema = z.infer<typeof createMemberSchema>;
export type UpdateMemberSchema = z.infer<typeof updateMemberSchema>;
export type MemberSchema = z.infer<typeof memberSchema>;
