import z from "zod";
import { GenderEnum } from "../enums/gender.enum";
import { DocTypeEnum } from "../enums/doctype.enum";
import { baseZ } from "./_base";
import { membershipSchema } from "./membership";

export const memberSchema = z
  .object({
    firstName: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(50, "El nombre no puede tener más de 50 caracteres"),
    lastName: z
      .string()
      .min(3, "El apellido debe tener al menos 3 caracteres")
      .max(50, "El apellido no puede tener más de 50 caracteres"),
    gender: GenderEnum.nullable(),
    birthDate: z.coerce
      .date({
        error: "La fecha de nacimiento debe ser una fecha válida",
      })
      .max(new Date(), "La fecha de nacimiento no puede ser en el futuro")
      .optional()
      .nullable()
      .refine(
        (date) => {
          if (!date) return true;
          const today = new Date();
          const minAge = new Date(
            today.getFullYear() - 18,
            today.getMonth(),
            today.getDate()
          );
          return date <= minAge;
        },
        {
          message: "El miembro debe tener al menos 18 años",
        }
      ),
    height: z.coerce
      .number("La altura debe ser un número")
      .positive("La altura debe ser un número positivo")
      .optional()
      .nullable(),
    weight: z.coerce
      .number("El peso debe ser un número")
      .positive("El peso debe ser un número positivo")
      .optional()
      .nullable(),
    docType: DocTypeEnum,
    docNumber: z
      .string("El número de documento debe ser un texto")
      .max(20, "El número de documento no puede tener más de 20 caracteres"),
    phoneNumber: z
      .string()
      .regex(/^9\d{8}$/, "El teléfono debe empezar con 9 y tener 9 dígitos")
      .optional()
      .nullable(),
    email: z.email("Correo electrónico inválido").optional().nullable(),
    isActive: z.boolean().default(true),
    memberships: membershipSchema.array().optional(),
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
  isActive: true,
});

export type MemberInsert = z.infer<typeof memberInsertSchema>;

export const memberUpdateSchema = memberInsertSchema.partial();

export type MemberUpdate = z.infer<typeof memberUpdateSchema>;
