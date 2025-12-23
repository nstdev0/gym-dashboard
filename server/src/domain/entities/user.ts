import z from "zod";
import { baseZ } from "./_base";
import { RoleEnum } from "../enums/role.enum";

export const userSchema = z
  .object({
    role: RoleEnum,
    firstName: z
      .string()
      .min(3, "El nombre es obligatorio y debe tener al menos 3 caracteres"),
    lastName: z
      .string()
      .min(3, "El apellido debe tener al menos 3 caracteres")
      .optional()
      .nullable(),
    username: z
      .string()
      .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
      .regex(/^\S+$/, "El nombre de usuario no debe contener espacios"),
    email: z.email("Email inválido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    isActive: z.boolean().default(true),
  })
  .extend(baseZ.shape);

export type User = z.infer<typeof userSchema>;

export const userInsertSchema = userSchema.pick({
  role: true,
  firstName: true,
  lastName: true,
  username: true,
  email: true,
  password: true,
});

export type UserInsert = z.infer<typeof userInsertSchema>;

export const userUpdateSchema = userSchema.partial();

export type UserUpdate = z.infer<typeof userUpdateSchema>;
