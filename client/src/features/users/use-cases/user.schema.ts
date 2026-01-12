import z from "zod";
import { RoleEnum } from "../../../types/enums";
import { capitalizeText } from "../../../lib/utils";

// ---------------------------------------------------------
// BASE SHAPE
// ---------------------------------------------------------
const userBaseShape = z.object({
  firstName: z
    .string()
    .min(1, "Nombre requerido")
    .min(2, "Mínimo 2 caracteres")
    .transform(capitalizeText),

  lastName: z.string().transform(capitalizeText).optional().nullable(),

  username: z
    .string()
    .min(4, "Mínimo 4 caracteres")
    .regex(/^[a-z0-9_]+$/, "Solo minúsculas, números y guión bajo")
    .optional()
    .nullable(),

  email: z.email("Email inválido"),

  role: RoleEnum.default("STAFF"),

  isActive: z.boolean().default(true),
});

// ---------------------------------------------------------
// SCHEMAS CONCRETOS
// ---------------------------------------------------------

/** SCHEMA DE CREACIÓN (Password obligatoria) */
export const userCreateSchema = userBaseShape.extend({
  password: z
    .string()
    .min(1, "Contraseña requerida")
    .min(6, "Mínimo 6 caracteres"),
});
export type UserCreateInput = z.infer<typeof userCreateSchema>;

/** SCHEMA DE ACTUALIZACIÓN (Password opcional) */
export const userUpdateSchema = userBaseShape.partial().extend({
  password: z.string().min(6, "Mínimo 6 caracteres").optional(),
});
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;

/** LOGIN */
export const loginSchema = z.object({
  email: z.email("Email no válido"),
  password: z
    .string()
    .min(1, "Contraseña requerida")
    .min(8, "Mínimo 8 caracteres"),
});
export type LoginInput = z.infer<typeof loginSchema>;
