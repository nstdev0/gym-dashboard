import { uuid, z } from "zod";
import { InvoiceStatus, PaymentMethod } from "../../../generated/prisma/enums";
import { baseSchema, dateSchema, uuidSchema } from "./base.schema";

const amountSchema = z
  .number("El monto debe ser un número")
  .min(0, "El monto no puede ser negativo")
  .positive("El monto debe ser mayor a 0")
  .multipleOf(0.01, "El monto no puede tener más de 2 decimales");

export const invoiceSchema = baseSchema.merge(
  z.object({
    memberId: uuidSchema,
    membershipId: uuidSchema.optional().nullable(),

    amount: amountSchema,
    issuedAt: dateSchema,
    issuedBy: uuidSchema,
    updatedBy: uuidSchema.optional(),
    paidAt: dateSchema.optional().nullable(),
    status: z.enum(InvoiceStatus, "Estado de factura inválido"),
    method: z.enum(PaymentMethod, "Método de pago inválido"),
  })
);

export const createInvoiceSchema = invoiceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
// .superRefine((data, ctx) => {
/**
 * LOGICA DE NEGOCIO AVANZADA (Cross-field Validation)
 * Aquí validamos la coherencia entre campos.
 */

//   // REGLA 1: Si está PAGADA, debe tener fecha de pago.
//   if (data.status === InvoiceStatus.PAID && !data.paidAt) {
//     // Si el frontend no envió fecha, asumimos "ahora mismo" o lanzamos error.
//     // Aquí decidimos forzar error para ser estrictos, o podrías mutar data.paidAt
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       message:
//         "Si la factura está pagada, la fecha de pago (paidAt) es obligatoria.",
//       path: ["paidAt"],
//     });
//   }

//   // REGLA 2: Si está PENDIENTE, NO debe tener fecha de pago futura o pasada.
//   if (data.status === InvoiceStatus.PENDING && data.paidAt) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       message: "Una factura pendiente no puede tener fecha de pago.",
//       path: ["paidAt"],
//     });
//   }

//   // REGLA 3: Validación de montos absurdos (Safety check)
//   if (data.amount > 100000) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       message: "¿Seguro? El monto parece inusualmente alto para un gimnasio.",
//       path: ["amount"],
//     });
//   }
// });

/**
 * ------------------------------------------------------------------
 * 3. SCHEMA DE ACTUALIZACIÓN (Input)
 * Para cuando editas una factura existente.
 * ------------------------------------------------------------------
 */
export const updateInvoiceSchema = createInvoiceSchema.pick({
  updatedBy: true,
  paidAt: true,
  status: true,
});
// .refine((data) => {
// Ejemplo: Si cambias el estado a PAID, asegúrate de enviar o tener paidAt
// (Nota: Las validaciones parciales son complejas porque no tienes todo el objeto,
//  a veces es mejor validar esto en la lógica del servicio).
// return true;
// });

/**
 * ------------------------------------------------------------------
 * 4. TIPOS INFERIDOS
 * TypeScript extraerá los tipos automáticamente de Zod.
 * ¡No necesitas escribir interfaces manualmente!
 * ------------------------------------------------------------------
 */
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;
export type InvoiceSchema = z.infer<typeof invoiceSchema>;
