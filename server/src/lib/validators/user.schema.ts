import z from "zod";
import { baseSchema, roleSchema } from "./base.schema";

export const userSchema = baseSchema.merge(
  z.object({
    role: roleSchema.default("STAFF"),
    firstName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    lastName: z
      .string()
      .min(3, "El apellido debe tener al menos 3 caracteres")
      .optional()
      .nullable(),
    username: z
      .string()
      .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
      .regex(
        /^[a-zA-Z0-9]+(?:[._][a-zA-Z0-9]+)*$/,
        "El nombre de usuario solo puede contener letras, números, puntos y guiones bajos"
      )
      .optional()
      .nullable(),
    email: z.email("El correo electrónico no es válido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    isActive: z.boolean().default(true),
  })
);

export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateUserSchema = createUserSchema.partial();

export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type UserSchema = z.infer<typeof userSchema>;
