import { z } from "zod";

export const uuidSchema = z.uuid("ID inválido (Debe ser UUID)");
export const dateSchema = z.coerce.date("Fecha inválida");
export const phoneSchema = z
  .string()
  .regex(/^9\d{8}$/, "El teléfono debe empezar con 9 y tener 9 dígitos")
  .optional()
  .nullable();
export const genderSchema = z.enum(["MALE", "FEMALE"]);
export const docTypeSchema = z.enum(["DNI", "CE", "PASSPORT"]);
export const paymentMethodSchema = z.enum([
  "CREDIT_CARD",
  "DEBIT_CARD",
  "CASH",
  "BANK_TRANSFER",
  "YAPE",
  "PLIN",
  "OTHER",
]);
export const roleSchema = z.enum(["OWNER", "ADMIN", "STAFF"]);
export const membershipStatus = z.enum([
  "ACTIVE",
  "INACTIVE",
  "EXPIRED",
  "PAUSED",
]);
export const priceSchema = z
  .number("El precio debe ser un número")
  .min(0, "El precio no puede ser negativo")
  .positive("El precio debe ser mayor a 0")
  .multipleOf(0.01, "El precio no puede tener más de 2 decimales");

export const baseSchema = z.object({
  id: z.uuid("ID inválido (Debe ser UUID)"),
  createdAt: z.date("Fecha de creación inválida"),
  updatedAt: z.date("Fecha de actualización inválida").optional(),
});
