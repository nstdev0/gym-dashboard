import z from "zod";
import { baseZ } from "./_base";
import { RoleEnum } from "../enums/role.enum";

export const userSchema = z
  .object({
    role: RoleEnum.default("STAFF"),
    firstName: z
      .string()
      .min(3, "El nombre es obligatorio y debe tener al menos 3 caracteres"),
    lastName: z.preprocess((value) => {
      if (typeof value === "string" && value.trim() === "") {
        return null;
      }
      return value;
    }, z.string().min(3, "El apellido debe tener al menos 3 caracteres").optional().nullable()),
    username: z.preprocess((value) => {
      if (typeof value === "string" && value.trim() === "") {
        return null;
      }
      return value;
    }, z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres").regex(/^\S+$/, "El nombre de usuario no debe contener espacios").optional().nullable()),
    email: z.email("Email inválido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    isActive: z.boolean().default(true),
  })
  .extend(baseZ.shape);

export type User = z.infer<typeof userSchema>;

export const userInsertSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type UserInsert = z.infer<typeof userInsertSchema>;

export const userUpdateSchema = userSchema.partial();

export type UserUpdate = z.infer<typeof userUpdateSchema>;

export const userRegisterSchema = userSchema
  .pick({
    firstName: true,
    lastName: true,
    username: true,
    email: true,
    password: true,
    role: true,
  })
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });
export type UserRegister = z.infer<typeof userRegisterSchema>;
