import z from "zod";
import { GenderEnum } from "../enums/gender.enum";
import { DocTypeEnum } from "../enums/doctype.enum";
import { baseZ } from "./_base";

export const memberSchema = z
  .object({
    firstName: z
      .string()
      .min(3, "El nombre es obligatorio y debe tener al menos 3 caracteres")
      .max(50, "El nombre no puede tener más de 50 caracteres"),
    lastName: z
      .string()
      .min(3, "El apellido debe tener al menos 3 caracteres")
      .max(50, "El apellido no puede tener más de 50 caracteres"),
    gender: GenderEnum.optional().nullable(),
    birthDate: z.date("Fecha de nacimiento inválida").optional().nullable(),
    height: z
      .number("La altura debe ser un número")
      .positive("La altura debe ser un número positivo")
      .optional()
      .nullable(),
    weight: z
      .number("El peso debe ser un número")
      .positive("El peso debe ser un número positivo")
      .optional()
      .nullable(),
    docType: DocTypeEnum,
    docNumber: z
      .number("El número de documento debe ser un número")
      .positive("El número de documento debe ser positivo"),
    phoneNumber: z
      .string()
      .regex(/^9\d{8}$/, "El teléfono debe empezar con 9 y tener 9 dígitos")
      .optional()
      .nullable(),
    email: z.email("Correo electrónico inválido").optional().nullable(),
    isActive: z.boolean().default(true),
  })
  .extend(baseZ.shape);

export type Member = z.infer<typeof memberSchema>;

export const memberInsertSchema = memberSchema.pick({
  firstName: true,
  lastName: true,
  gender: true,
  birthDate: true,
  height: true,
  weight: true,
  docType: true,
  docNumber: true,
  phoneNumber: true,
  email: true,
});

export type MemberInsert = z.infer<typeof memberInsertSchema>;

export const memberUpdateSchema = memberInsertSchema.partial();

export type MemberUpdate = z.infer<typeof memberUpdateSchema>;
