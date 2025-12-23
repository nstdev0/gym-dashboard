import z from "zod";
import { baseZ } from "./_base";
import { InvoiceStatusEnum } from "../enums/invoice-status.enum";
import { PaymentMethodEnum } from "../enums/payment-method.enum";

export const InvoiceSchema = z
  .object({
    memberId: z.number("El ID del miembro debe ser un número"),
    membershipId: z
      .number("El ID de la membresía debe ser un número")
      .optional()
      .nullable(),
    amount: z
      .number("El monto debe ser un número")
      .positive("El monto debe ser un número positivo"),
    issuedAt: z.date("La fecha de emisión es inválida"),
    issuedBy: z
      .number("El ID del emisor debe ser un número")
      .optional()
      .nullable(),
    paidAt: z.date("La fecha de pago es inválida").optional().nullable(),
    status: InvoiceStatusEnum,
    method: PaymentMethodEnum,
  })
  .extend(baseZ.shape);

export type Invoice = z.infer<typeof InvoiceSchema>;

export const InvoiceInsertSchema = InvoiceSchema.pick({
  memberId: true,
  membershipId: true,
  amount: true,
  issuedAt: true,
  issuedBy: true,
  paidAt: true,
  status: true,
  method: true,
});

export type InvoiceInsert = z.infer<typeof InvoiceInsertSchema>;

export const InvoiceUpdateSchema = InvoiceInsertSchema.partial();

export type InvoiceUpdate = z.infer<typeof InvoiceUpdateSchema>;
