import z from "zod";
import { RoleEnum } from "../../../../server/src/domain/enums/role.enum"; // Ajusta tu import
import { capitalizeText } from "../../../../server/src/lib/utils/capitalize-text";

// ---------------------------------------------------------
// BASE SHAPE (Datos públicos/comunes)
// ---------------------------------------------------------
const userBaseShape = z.object({
  firstName: z
    .string("Nombre requerido")
    .min(2, "Mínimo 2 caracteres")
    .transform(capitalizeText),

  lastName: z.string().transform(capitalizeText).optional().nullable(),

  username: z
    .string()
    .min(4, "Mínimo 4 caracteres")
    .regex(/^[a-z0-9_]+$/, "Solo minúsculas, números y guión bajo")
    .optional()
    .nullable(),

  email: z.string("Email requerido").email("Email inválido"),

  role: RoleEnum.default("STAFF"), // Valor por defecto si no se envía

  isActive: z.boolean().default(true),
});

// ---------------------------------------------------------
// SCHEMAS CONCRETOS
// ---------------------------------------------------------

/** SCHEMA DE SALIDA (Lo que recibes del backend - SIN PASSWORD) */
export const userSchema = userBaseShape.extend({
  id: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type User = z.infer<typeof userSchema>;

/** SCHEMA DE CREACIÓN (Password obligatoria) */
export const userCreateSchema = userBaseShape.extend({
  password: z.string("Contraseña requerida").min(6, "Mínimo 6 caracteres"),
});
export type UserCreateInput = z.infer<typeof userCreateSchema>;

/** SCHEMA DE ACTUALIZACIÓN (Password opcional) */
export const userUpdateSchema = userBaseShape.partial().extend({
  password: z.string().min(6).optional(), // Solo si quiere cambiarla
});
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
